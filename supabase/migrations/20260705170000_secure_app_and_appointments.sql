begin;

-- App roles are managed explicitly. Revoke the two legacy/test admin mappings and
-- grant the intended cabinet account administrative access.
update public.users
set role = 'user'
where role = 'admin';

insert into public.users (id, role)
select id, 'admin'
from auth.users
where lower(email) in (lower('drabdessadoksete@gmail.com'), lower('cabinetdentairesete@outlook.fr'))
on conflict (id) do update set role = excluded.role;

alter table public.users
  drop constraint if exists users_role_check;
alter table public.users
  add constraint users_role_check check (role in ('user', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Dedicated pre-appointment requests keep operational fields structured and
-- private instead of embedding personal details in a generic message string.
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  city text not null default '',
  specialty text not null,
  contact_preference text not null,
  callback_window text not null,
  note text not null default '',
  status text not null default 'new',
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_specialty_check check (specialty in ('implantologie', 'orthodontie')),
  constraint appointments_contact_preference_check check (contact_preference in ('Téléphone', 'E-mail')),
  constraint appointments_callback_window_check check (callback_window in ('Peu importe', 'Matin', 'Midi', 'Après-midi', 'Fin de journée')),
  constraint appointments_status_check check (status in ('new', 'contacted', 'scheduled', 'closed')),
  constraint appointments_name_length_check check (char_length(trim(name)) between 2 and 120),
  constraint appointments_phone_length_check check (char_length(trim(phone)) between 6 and 40),
  constraint appointments_email_length_check check (char_length(email) <= 254),
  constraint appointments_city_length_check check (char_length(city) <= 120),
  constraint appointments_note_length_check check (char_length(note) <= 2000)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

-- Remove every pre-existing policy on app tables, then rebuild a least-privilege
-- policy set. This also removes the duplicate policy that exposed draft articles.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('articles', 'gallery_images', 'media', 'messages', 'services', 'users', 'appointments')
  loop
    execute format('drop policy if exists %I on %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  end loop;
end
$$;

alter table public.articles enable row level security;
alter table public.gallery_images enable row level security;
alter table public.media enable row level security;
alter table public.messages enable row level security;
alter table public.services enable row level security;
alter table public.users enable row level security;
alter table public.appointments enable row level security;

create policy "Public can read published articles"
on public.articles for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage articles"
on public.articles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Public can read gallery"
on public.gallery_images for select
to anon, authenticated
using (true);

create policy "Admins manage gallery"
on public.gallery_images for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Public can read services"
on public.services for select
to anon, authenticated
using (true);

create policy "Admins manage services"
on public.services for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins manage media"
on public.media for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Public can submit messages"
on public.messages for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 120
  and char_length(email) between 3 and 254
  and char_length(coalesce(phone, '')) <= 40
  and char_length(trim(message)) between 1 and 5000
);

create policy "Admins read messages"
on public.messages for select
to authenticated
using ((select public.is_admin()));

create policy "Admins delete messages"
on public.messages for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can submit appointments"
on public.appointments for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(trim(name)) between 2 and 120
  and char_length(trim(phone)) between 6 and 40
  and char_length(email) <= 254
  and char_length(city) <= 120
  and char_length(note) <= 2000
);

create policy "Admins read appointments"
on public.appointments for select
to authenticated
using ((select public.is_admin()));

create policy "Admins update appointments"
on public.appointments for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins delete appointments"
on public.appointments for delete
to authenticated
using ((select public.is_admin()));

-- Table grants are narrowed as well as RLS. RLS remains the final authorization
-- layer for every authenticated administrative operation.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.articles, public.gallery_images, public.services to anon, authenticated;
grant insert on public.messages, public.appointments to anon, authenticated;
grant select, insert, update, delete on public.articles, public.gallery_images, public.media,
  public.messages, public.services, public.appointments to authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

-- Public images remain viewable, but only an authenticated app admin can upload,
-- replace, or delete them. File type and size are constrained at bucket level.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
where id in ('gallery', 'media');

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
  loop
    execute format('drop policy if exists %I on storage.objects', policy_record.policyname);
  end loop;
end
$$;

create policy "Public reads site images"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('gallery', 'media'));

create policy "Admins upload site images"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('gallery', 'media')
  and (select public.is_admin())
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'gif', 'avif')
);

create policy "Admins update site images"
on storage.objects for update
to authenticated
using (bucket_id in ('gallery', 'media') and (select public.is_admin()))
with check (
  bucket_id in ('gallery', 'media')
  and (select public.is_admin())
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'gif', 'avif')
);

create policy "Admins delete site images"
on storage.objects for delete
to authenticated
using (bucket_id in ('gallery', 'media') and (select public.is_admin()));

commit;
