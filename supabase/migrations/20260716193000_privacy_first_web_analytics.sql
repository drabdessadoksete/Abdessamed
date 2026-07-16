begin;

-- Privacy-first analytics are stored as separate aggregate cubes. Keeping the
-- dimensions apart avoids rebuilding a visitor profile from combinations such
-- as browser + device + location. This schema is not exposed through PostgREST.
create schema if not exists private_analytics;

revoke all on schema private_analytics from public, anon, authenticated;

create table if not exists private_analytics.hourly (
  bucket_start timestamptz not null,
  page_path text not null,
  sessions bigint not null default 0 check (sessions >= 0),
  pageviews bigint not null default 0 check (pageviews >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  conversions bigint not null default 0 check (conversions >= 0),
  primary key (bucket_start, page_path),
  check (char_length(page_path) between 1 and 180)
);

create index if not exists analytics_hourly_page_bucket_idx
  on private_analytics.hourly (page_path, bucket_start desc);

create table if not exists private_analytics.dimension_hourly (
  bucket_start timestamptz not null,
  page_path text not null,
  dimension_name text not null check (dimension_name in (
    'source', 'device', 'os', 'browser', 'country', 'region',
    'click_kind', 'element', 'conversion'
  )),
  dimension_value text not null,
  sessions bigint not null default 0 check (sessions >= 0),
  pageviews bigint not null default 0 check (pageviews >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  conversions bigint not null default 0 check (conversions >= 0),
  primary key (bucket_start, page_path, dimension_name, dimension_value),
  check (char_length(page_path) between 1 and 180),
  check (char_length(dimension_value) between 1 and 64)
);

create index if not exists analytics_dimension_lookup_idx
  on private_analytics.dimension_hourly (dimension_name, dimension_value, bucket_start desc);

create index if not exists analytics_dimension_page_idx
  on private_analytics.dimension_hourly (page_path, dimension_name, bucket_start desc);

create table if not exists private_analytics.heatmap_hourly (
  bucket_start timestamptz not null,
  page_path text not null,
  device_type text not null check (device_type in ('desktop', 'tablet', 'mobile', 'other')),
  viewport_class text not null check (viewport_class in ('sm', 'md', 'lg', 'xl', 'other')),
  click_kind text not null check (click_kind in (
    'phone', 'email', 'map', 'appointment', 'contact', 'navigation',
    'treatment', 'outbound', 'other'
  )),
  x_bucket smallint not null check (x_bucket between 0 and 19),
  y_bucket smallint not null check (y_bucket between 0 and 31),
  clicks bigint not null default 0 check (clicks >= 0),
  primary key (
    bucket_start, page_path, device_type, viewport_class,
    click_kind, x_bucket, y_bucket
  ),
  check (char_length(page_path) between 1 and 180)
);

create index if not exists analytics_heatmap_page_bucket_idx
  on private_analytics.heatmap_hourly (page_path, bucket_start desc, device_type);

create table if not exists private_analytics.maintenance (
  key text primary key,
  last_cleanup timestamptz not null
);

insert into private_analytics.maintenance (key, last_cleanup)
values ('retention', '-infinity'::timestamptz)
on conflict (key) do nothing;

alter table private_analytics.hourly enable row level security;
alter table private_analytics.dimension_hourly enable row level security;
alter table private_analytics.heatmap_hourly enable row level security;
alter table private_analytics.maintenance enable row level security;

revoke all on all tables in schema private_analytics from public, anon, authenticated;

-- Internal helper used only by the admin-checked dashboard RPC below.
create or replace function private_analytics.breakdown_json(
  p_from timestamptz,
  p_to timestamptz,
  p_dimension text,
  p_page_path text default null
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with grouped as (
    select
      dimension_value,
      sum(sessions)::bigint as sessions,
      sum(pageviews)::bigint as pageviews,
      sum(clicks)::bigint as clicks,
      sum(conversions)::bigint as conversions
    from private_analytics.dimension_hourly
    where bucket_start >= p_from
      and bucket_start < p_to
      and dimension_name = p_dimension
      and (p_page_path is null or page_path = p_page_path)
    group by dimension_value
  ), privacy_grouped as (
    select
      case
        when p_dimension in ('country', 'region') and sessions < 5 then 'other'
        else dimension_value
      end as value,
      sessions,
      pageviews,
      clicks,
      conversions
    from grouped
  ), rolled as (
    select
      value,
      sum(sessions)::bigint as sessions,
      sum(pageviews)::bigint as pageviews,
      sum(clicks)::bigint as clicks,
      sum(conversions)::bigint as conversions
    from privacy_grouped
    group by value
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'value', value,
        'sessions', sessions,
        'pageviews', pageviews,
        'clicks', clicks,
        'conversions', conversions
      )
      order by
        case when p_dimension in ('element', 'click_kind') then clicks
             when p_dimension = 'conversion' then conversions
             else sessions end desc,
        value
    ),
    '[]'::jsonb
  )
  from rolled;
$$;

revoke all on function private_analytics.breakdown_json(timestamptz, timestamptz, text, text)
  from public, anon, authenticated;

-- The write boundary is service-role-only. Anonymous browsers call the
-- analytics-ingest Edge Function, which validates and normalizes each request.
create or replace function public.record_web_analytics(
  p_consent boolean,
  p_event text,
  p_page_path text,
  p_source text default 'direct',
  p_device text default 'other',
  p_os text default 'other',
  p_browser text default 'other',
  p_country text default 'unknown',
  p_region text default 'unknown',
  p_click_kind text default 'other',
  p_element text default 'other',
  p_conversion_kind text default 'other',
  p_viewport text default 'other',
  p_x_bucket smallint default null,
  p_y_bucket smallint default null
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_bucket timestamptz := date_trunc('hour', clock_timestamp());
  v_page text;
  v_source text;
  v_device text;
  v_os text;
  v_browser text;
  v_country text;
  v_region text;
  v_click_kind text;
  v_element text;
  v_conversion text;
  v_viewport text;
  v_sessions bigint := 0;
  v_pageviews bigint := 0;
  v_clicks bigint := 0;
  v_conversions bigint := 0;
  v_dimension_name text;
  v_dimension_value text;
  v_cleanup_due boolean := false;
begin
  if p_consent is not true then
    return false;
  end if;

  if p_event not in ('session_start', 'page_view', 'click', 'conversion') then
    return false;
  end if;

  v_page := case
    when p_page_path ~ '^/[A-Za-z0-9/_-]{0,179}$'
      and p_page_path not like '/admin/%'
      and p_page_path not like '/login/%'
    then left(p_page_path, 180)
    else null
  end;
  if v_page is null then return false; end if;

  v_source := case when p_source in (
    'direct', 'google', 'bing', 'facebook', 'instagram', 'doctolib',
    'newsletter', 'referral', 'campaign', 'other'
  ) then p_source else 'other' end;
  v_device := case when p_device in ('desktop', 'tablet', 'mobile', 'other') then p_device else 'other' end;
  v_os := case when p_os in ('ios', 'android', 'windows', 'macos', 'linux', 'chromeos', 'other') then p_os else 'other' end;
  v_browser := case when p_browser in ('chrome', 'safari', 'firefox', 'edge', 'samsung', 'other') then p_browser else 'other' end;
  v_country := case when upper(coalesce(p_country, '')) ~ '^[A-Z]{2}$' then upper(p_country) else 'unknown' end;
  v_region := case when upper(coalesce(p_region, '')) ~ '^[A-Z0-9-]{1,12}$' then upper(p_region) else 'unknown' end;
  v_click_kind := case when p_click_kind in (
    'phone', 'email', 'map', 'appointment', 'contact', 'navigation',
    'treatment', 'outbound', 'other'
  ) then p_click_kind else 'other' end;
  v_element := case when p_element ~ '^[a-z0-9_-]{1,64}$' then p_element else 'other' end;
  v_conversion := case when p_conversion_kind in ('contact', 'pre_appointment', 'other') then p_conversion_kind else 'other' end;
  v_viewport := case when p_viewport in ('sm', 'md', 'lg', 'xl', 'other') then p_viewport else 'other' end;

  if p_event = 'session_start' then v_sessions := 1;
  elsif p_event = 'page_view' then v_pageviews := 1;
  elsif p_event = 'click' then v_clicks := 1;
  elsif p_event = 'conversion' then v_conversions := 1;
  end if;

  insert into private_analytics.hourly (
    bucket_start, page_path, sessions, pageviews, clicks, conversions
  ) values (
    v_bucket, v_page, v_sessions, v_pageviews, v_clicks, v_conversions
  )
  on conflict (bucket_start, page_path) do update set
    sessions = private_analytics.hourly.sessions + excluded.sessions,
    pageviews = private_analytics.hourly.pageviews + excluded.pageviews,
    clicks = private_analytics.hourly.clicks + excluded.clicks,
    conversions = private_analytics.hourly.conversions + excluded.conversions;

  for v_dimension_name, v_dimension_value in
    select d.name, d.value
    from (values
      ('source'::text, v_source),
      ('device'::text, v_device),
      ('os'::text, v_os),
      ('browser'::text, v_browser),
      ('country'::text, v_country),
      ('region'::text, v_region)
    ) as d(name, value)
  loop
    insert into private_analytics.dimension_hourly (
      bucket_start, page_path, dimension_name, dimension_value,
      sessions, pageviews, clicks, conversions
    ) values (
      v_bucket, v_page, v_dimension_name, v_dimension_value,
      v_sessions, v_pageviews, v_clicks, v_conversions
    )
    on conflict (bucket_start, page_path, dimension_name, dimension_value) do update set
      sessions = private_analytics.dimension_hourly.sessions + excluded.sessions,
      pageviews = private_analytics.dimension_hourly.pageviews + excluded.pageviews,
      clicks = private_analytics.dimension_hourly.clicks + excluded.clicks,
      conversions = private_analytics.dimension_hourly.conversions + excluded.conversions;
  end loop;

  if p_event = 'click' then
    for v_dimension_name, v_dimension_value in
      select d.name, d.value
      from (values
        ('click_kind'::text, v_click_kind),
        ('element'::text, v_element)
      ) as d(name, value)
    loop
      insert into private_analytics.dimension_hourly (
        bucket_start, page_path, dimension_name, dimension_value, clicks
      ) values (v_bucket, v_page, v_dimension_name, v_dimension_value, 1)
      on conflict (bucket_start, page_path, dimension_name, dimension_value) do update set
        clicks = private_analytics.dimension_hourly.clicks + 1;
    end loop;

    if p_x_bucket between 0 and 19 and p_y_bucket between 0 and 31 then
      insert into private_analytics.heatmap_hourly (
        bucket_start, page_path, device_type, viewport_class,
        click_kind, x_bucket, y_bucket, clicks
      ) values (
        v_bucket, v_page, v_device, v_viewport,
        v_click_kind, p_x_bucket, p_y_bucket, 1
      )
      on conflict (
        bucket_start, page_path, device_type, viewport_class,
        click_kind, x_bucket, y_bucket
      ) do update set clicks = private_analytics.heatmap_hourly.clicks + 1;
    end if;
  elsif p_event = 'conversion' then
    insert into private_analytics.dimension_hourly (
      bucket_start, page_path, dimension_name, dimension_value, conversions
    ) values (v_bucket, v_page, 'conversion', v_conversion, 1)
    on conflict (bucket_start, page_path, dimension_name, dimension_value) do update set
      conversions = private_analytics.dimension_hourly.conversions + 1;
  end if;

  -- Retention is checked cheaply on ingestion and actually runs at most daily.
  update private_analytics.maintenance
  set last_cleanup = clock_timestamp()
  where key = 'retention'
    and last_cleanup < clock_timestamp() - interval '1 day'
  returning true into v_cleanup_due;

  if coalesce(v_cleanup_due, false) then
    delete from private_analytics.heatmap_hourly
    where bucket_start < clock_timestamp() - interval '90 days';
    delete from private_analytics.dimension_hourly
    where bucket_start < clock_timestamp() - interval '400 days';
    delete from private_analytics.hourly
    where bucket_start < clock_timestamp() - interval '400 days';
  end if;

  return true;
end;
$$;

revoke all on function public.record_web_analytics(
  boolean, text, text, text, text, text, text, text, text,
  text, text, text, text, smallint, smallint
) from public, anon, authenticated;
grant execute on function public.record_web_analytics(
  boolean, text, text, text, text, text, text, text, text,
  text, text, text, text, smallint, smallint
) to service_role;

create or replace function public.get_web_analytics_dashboard(
  p_from timestamptz,
  p_to timestamptz
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_granularity text;
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_from >= p_to
    or p_to > clock_timestamp() + interval '5 minutes'
    or p_to - p_from > interval '400 days' then
    raise exception 'Invalid analytics time range' using errcode = '22023';
  end if;

  v_granularity := case
    when p_to - p_from <= interval '48 hours' then 'hour'
    when p_to - p_from <= interval '62 days' then 'day'
    else 'week'
  end;

  with totals as (
    select
      coalesce(sum(sessions), 0)::bigint as sessions,
      coalesce(sum(pageviews), 0)::bigint as pageviews,
      coalesce(sum(clicks), 0)::bigint as clicks,
      coalesce(sum(conversions), 0)::bigint as conversions
    from private_analytics.hourly
    where bucket_start >= p_from and bucket_start < p_to
  ), timeline as (
    select
      case v_granularity
        when 'hour' then date_trunc('hour', bucket_start)
        when 'day' then date_trunc('day', bucket_start)
        else date_trunc('week', bucket_start)
      end as bucket_start,
      sum(sessions)::bigint as sessions,
      sum(pageviews)::bigint as pageviews,
      sum(clicks)::bigint as clicks,
      sum(conversions)::bigint as conversions
    from private_analytics.hourly
    where bucket_start >= p_from and bucket_start < p_to
    group by 1
    order by 1
  ), pages as (
    select
      page_path,
      sum(sessions)::bigint as sessions,
      sum(pageviews)::bigint as pageviews,
      sum(clicks)::bigint as clicks,
      sum(conversions)::bigint as conversions
    from private_analytics.hourly
    where bucket_start >= p_from and bucket_start < p_to
    group by page_path
    order by pageviews desc, page_path
    limit 50
  )
  select jsonb_build_object(
    'granularity', v_granularity,
    'summary', (select to_jsonb(totals) from totals),
    'timeline', coalesce((select jsonb_agg(to_jsonb(timeline) order by bucket_start) from timeline), '[]'::jsonb),
    'pages', coalesce((select jsonb_agg(to_jsonb(pages) order by pageviews desc, page_path) from pages), '[]'::jsonb),
    'dimensions', jsonb_build_object(
      'source', private_analytics.breakdown_json(p_from, p_to, 'source', null),
      'device', private_analytics.breakdown_json(p_from, p_to, 'device', null),
      'os', private_analytics.breakdown_json(p_from, p_to, 'os', null),
      'browser', private_analytics.breakdown_json(p_from, p_to, 'browser', null),
      'country', private_analytics.breakdown_json(p_from, p_to, 'country', null),
      'region', private_analytics.breakdown_json(p_from, p_to, 'region', null),
      'element', private_analytics.breakdown_json(p_from, p_to, 'element', null),
      'click_kind', private_analytics.breakdown_json(p_from, p_to, 'click_kind', null),
      'conversion', private_analytics.breakdown_json(p_from, p_to, 'conversion', null)
    )
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_web_analytics_dashboard(timestamptz, timestamptz)
  from public, anon;
grant execute on function public.get_web_analytics_dashboard(timestamptz, timestamptz)
  to authenticated;

create or replace function public.get_web_analytics_heatmap(
  p_from timestamptz,
  p_to timestamptz,
  p_page_path text,
  p_device text default null,
  p_click_kind text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_from timestamptz;
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_from >= p_to
    or p_page_path !~ '^/[A-Za-z0-9/_-]{0,179}$'
    or (p_device is not null and p_device not in ('desktop', 'tablet', 'mobile', 'other'))
    or (p_click_kind is not null and p_click_kind not in (
      'phone', 'email', 'map', 'appointment', 'contact', 'navigation',
      'treatment', 'outbound', 'other'
    )) then
    raise exception 'Invalid heatmap filters' using errcode = '22023';
  end if;

  v_from := greatest(p_from, clock_timestamp() - interval '90 days');

  with points as (
    select x_bucket, y_bucket, sum(clicks)::bigint as clicks
    from private_analytics.heatmap_hourly
    where bucket_start >= v_from
      and bucket_start < p_to
      and page_path = p_page_path
      and (p_device is null or device_type = p_device)
      and (p_click_kind is null or click_kind = p_click_kind)
    group by x_bucket, y_bucket
    order by clicks desc, y_bucket, x_bucket
  )
  select jsonb_build_object(
    'from', v_from,
    'points', coalesce((select jsonb_agg(to_jsonb(points) order by clicks desc) from points), '[]'::jsonb),
    'elements', private_analytics.breakdown_json(v_from, p_to, 'element', p_page_path),
    'clickKinds', private_analytics.breakdown_json(v_from, p_to, 'click_kind', p_page_path)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_web_analytics_heatmap(timestamptz, timestamptz, text, text, text)
  from public, anon;
grant execute on function public.get_web_analytics_heatmap(timestamptz, timestamptz, text, text, text)
  to authenticated;

create or replace function public.prune_web_analytics()
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_heatmap bigint;
  v_dimensions bigint;
  v_hourly bigint;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  delete from private_analytics.heatmap_hourly
  where bucket_start < clock_timestamp() - interval '90 days';
  get diagnostics v_heatmap = row_count;

  delete from private_analytics.dimension_hourly
  where bucket_start < clock_timestamp() - interval '400 days';
  get diagnostics v_dimensions = row_count;

  delete from private_analytics.hourly
  where bucket_start < clock_timestamp() - interval '400 days';
  get diagnostics v_hourly = row_count;

  update private_analytics.maintenance
  set last_cleanup = clock_timestamp()
  where key = 'retention';

  return jsonb_build_object(
    'heatmapRows', v_heatmap,
    'dimensionRows', v_dimensions,
    'hourlyRows', v_hourly
  );
end;
$$;

revoke all on function public.prune_web_analytics() from public, anon;
grant execute on function public.prune_web_analytics() to authenticated;

commit;
