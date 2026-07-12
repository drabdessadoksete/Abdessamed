alter table public.appointments
  drop constraint if exists appointments_specialty_check;

alter table public.appointments
  add constraint appointments_specialty_check
  check (specialty in ('implantologie', 'orthodontie', 'pre-rendez-vous-telephonique'));
