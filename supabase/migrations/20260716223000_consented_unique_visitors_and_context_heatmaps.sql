begin;

-- Event-level rows contain only consented, server-hashed pseudonyms and a
-- strict allow-list of navigation metadata. They are isolated from PostgREST
-- and never joined to appointments, messages, authentication or form data.
create table if not exists private_analytics.visitor_events (
  id bigint generated always as identity primary key,
  event_id uuid not null unique,
  occurred_at timestamptz not null default clock_timestamp(),
  visitor_hash text not null check (visitor_hash ~ '^[0-9a-f]{64}$'),
  session_hash text not null check (session_hash ~ '^[0-9a-f]{64}$'),
  event_type text not null check (event_type in ('session_start', 'page_view', 'click', 'conversion')),
  page_path text not null check (char_length(page_path) between 1 and 180),
  source text not null,
  device_type text not null,
  os_type text not null,
  browser_type text not null,
  country_code text not null,
  region_code text not null,
  click_kind text not null,
  element_name text not null,
  conversion_kind text not null,
  viewport_class text not null,
  x_ratio smallint check (x_ratio between 0 and 10000),
  y_ratio smallint check (y_ratio between 0 and 10000)
);

create index if not exists analytics_visitor_events_time_idx
  on private_analytics.visitor_events (occurred_at desc);
create index if not exists analytics_visitor_events_visitor_time_idx
  on private_analytics.visitor_events (visitor_hash, occurred_at desc);
create index if not exists analytics_visitor_events_session_idx
  on private_analytics.visitor_events (session_hash, occurred_at desc);
create index if not exists analytics_visitor_events_heatmap_idx
  on private_analytics.visitor_events (page_path, device_type, occurred_at desc)
  where event_type = 'click' and x_ratio is not null and y_ratio is not null;

alter table private_analytics.visitor_events enable row level security;
revoke all on private_analytics.visitor_events from public, anon, authenticated;

insert into private_analytics.maintenance (key, last_cleanup)
values
  ('analytics_v2_cutover', clock_timestamp()),
  ('visitor_retention', '-infinity'::timestamptz)
on conflict (key) do nothing;

create or replace function public.record_web_analytics_v2(
  p_consent boolean,
  p_event_id uuid,
  p_event text,
  p_visitor_hash text,
  p_session_hash text,
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
  p_y_bucket smallint default null,
  p_x_ratio smallint default null,
  p_y_ratio smallint default null
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
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
  v_inserted bigint := 0;
  v_cleanup_due boolean := false;
begin
  if p_consent is not true
    or p_event_id is null
    or p_event not in ('session_start', 'page_view', 'click', 'conversion')
    or p_visitor_hash !~ '^[0-9a-f]{64}$'
    or p_session_hash !~ '^[0-9a-f]{64}$' then
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

  insert into private_analytics.visitor_events (
    event_id, visitor_hash, session_hash, event_type, page_path,
    source, device_type, os_type, browser_type, country_code, region_code,
    click_kind, element_name, conversion_kind, viewport_class, x_ratio, y_ratio
  ) values (
    p_event_id, p_visitor_hash, p_session_hash, p_event, v_page,
    v_source, v_device, v_os, v_browser, v_country, v_region,
    v_click_kind, v_element, v_conversion, v_viewport,
    case when p_event = 'click' and p_x_ratio between 0 and 10000 then p_x_ratio else null end,
    case when p_event = 'click' and p_y_ratio between 0 and 10000 then p_y_ratio else null end
  )
  on conflict (event_id) do nothing;
  get diagnostics v_inserted = row_count;

  -- The event UUID makes retries idempotent for both detailed and aggregate data.
  if v_inserted = 0 then return true; end if;

  perform public.record_web_analytics(
    true, p_event, v_page, v_source, v_device, v_os, v_browser,
    v_country, v_region, v_click_kind, v_element, v_conversion,
    v_viewport, p_x_bucket, p_y_bucket
  );

  update private_analytics.maintenance
  set last_cleanup = clock_timestamp()
  where key = 'visitor_retention'
    and last_cleanup < clock_timestamp() - interval '1 day'
  returning true into v_cleanup_due;

  if coalesce(v_cleanup_due, false) then
    -- Exact click positions have a shorter lifetime than the journey itself.
    update private_analytics.visitor_events
    set x_ratio = null, y_ratio = null
    where occurred_at < clock_timestamp() - interval '90 days'
      and (x_ratio is not null or y_ratio is not null);

    delete from private_analytics.visitor_events
    where occurred_at < clock_timestamp() - interval '390 days';
  end if;

  return true;
end;
$$;

revoke all on function public.record_web_analytics_v2(
  boolean, uuid, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, smallint, smallint, smallint, smallint
) from public, anon, authenticated;
grant execute on function public.record_web_analytics_v2(
  boolean, uuid, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, smallint, smallint, smallint, smallint
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
  ), visitor_totals as (
    select count(distinct visitor_hash)::bigint as visitors
    from private_analytics.visitor_events
    where occurred_at >= p_from and occurred_at < p_to
  ), timeline_counts as (
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
  ), visitor_timeline as (
    select
      case v_granularity
        when 'hour' then date_trunc('hour', occurred_at)
        when 'day' then date_trunc('day', occurred_at)
        else date_trunc('week', occurred_at)
      end as bucket_start,
      count(distinct visitor_hash)::bigint as visitors
    from private_analytics.visitor_events
    where occurred_at >= p_from and occurred_at < p_to
    group by 1
  ), timeline as (
    select
      t.bucket_start, t.sessions, t.pageviews, t.clicks, t.conversions,
      coalesce(v.visitors, 0)::bigint as visitors
    from timeline_counts t
    left join visitor_timeline v using (bucket_start)
    order by t.bucket_start
  ), page_totals as (
    select
      page_path,
      sum(sessions)::bigint as sessions,
      sum(pageviews)::bigint as pageviews,
      sum(clicks)::bigint as clicks,
      sum(conversions)::bigint as conversions
    from private_analytics.hourly
    where bucket_start >= p_from and bucket_start < p_to
    group by page_path
  ), page_visitors as (
    select page_path, count(distinct visitor_hash)::bigint as visitors
    from private_analytics.visitor_events
    where occurred_at >= p_from and occurred_at < p_to
    group by page_path
  ), pages as (
    select p.*, coalesce(v.visitors, 0)::bigint as visitors
    from page_totals p
    left join page_visitors v using (page_path)
    order by p.pageviews desc, p.page_path
    limit 50
  )
  select jsonb_build_object(
    'granularity', v_granularity,
    'summary', (
      select to_jsonb(totals) || jsonb_build_object('visitors', visitor_totals.visitors)
      from totals cross join visitor_totals
    ),
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
  v_cutover timestamptz;
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
  select last_cleanup into v_cutover
  from private_analytics.maintenance where key = 'analytics_v2_cutover';
  v_cutover := coalesce(v_cutover, clock_timestamp());

  with precise_points as (
    select
      least(9950, (x_ratio / 100) * 100 + 50)::smallint as x_ratio,
      least(9950, (y_ratio / 100) * 100 + 50)::smallint as y_ratio,
      count(*)::bigint as clicks
    from private_analytics.visitor_events
    where occurred_at >= v_from and occurred_at < p_to
      and event_type = 'click'
      and page_path = p_page_path
      and x_ratio is not null and y_ratio is not null
      and (p_device is null or device_type = p_device)
      and (p_click_kind is null or click_kind = p_click_kind)
    group by 1, 2
  ), legacy_points as (
    select
      round(((x_bucket::numeric + 0.5) / 20) * 10000)::smallint as x_ratio,
      round(((y_bucket::numeric + 0.5) / 32) * 10000)::smallint as y_ratio,
      sum(clicks)::bigint as clicks
    from private_analytics.heatmap_hourly
    where bucket_start >= v_from and bucket_start < least(p_to, v_cutover)
      and page_path = p_page_path
      and (p_device is null or device_type = p_device)
      and (p_click_kind is null or click_kind = p_click_kind)
    group by x_bucket, y_bucket
  ), all_points as (
    select x_ratio, y_ratio, clicks from precise_points
    union all
    select x_ratio, y_ratio, clicks from legacy_points
  ), points as (
    select x_ratio, y_ratio, sum(clicks)::bigint as clicks
    from all_points
    group by x_ratio, y_ratio
    order by clicks desc, y_ratio, x_ratio
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

create or replace function public.get_web_analytics_visitors(
  p_from timestamptz,
  p_to timestamptz,
  p_limit integer default 50
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_from >= p_to
    or p_to - p_from > interval '400 days'
    or p_limit < 1 or p_limit > 100 then
    raise exception 'Invalid visitor filters' using errcode = '22023';
  end if;

  with grouped as (
    select
      visitor_hash,
      min(occurred_at) as first_seen,
      max(occurred_at) as last_seen,
      count(distinct session_hash)::bigint as sessions,
      count(*) filter (where event_type = 'page_view')::bigint as pageviews,
      count(*) filter (where event_type = 'click')::bigint as clicks,
      count(*) filter (where event_type = 'conversion')::bigint as conversions,
      (array_agg(source order by occurred_at desc))[1] as source,
      (array_agg(device_type order by occurred_at desc))[1] as device,
      (array_agg(os_type order by occurred_at desc))[1] as os,
      (array_agg(browser_type order by occurred_at desc))[1] as browser,
      (array_agg(country_code order by occurred_at desc))[1] as country,
      (array_agg(region_code order by occurred_at desc))[1] as region,
      (array_agg(page_path order by occurred_at asc))[1] as entry_page,
      (array_agg(page_path order by occurred_at desc))[1] as last_page
    from private_analytics.visitor_events
    where occurred_at >= p_from and occurred_at < p_to
    group by visitor_hash
    order by max(occurred_at) desc
    limit p_limit
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'visitorId', visitor_hash,
      'label', 'Visiteur ' || upper(left(visitor_hash, 6)),
      'firstSeen', first_seen,
      'lastSeen', last_seen,
      'sessions', sessions,
      'pageviews', pageviews,
      'clicks', clicks,
      'conversions', conversions,
      'source', source,
      'device', device,
      'os', os,
      'browser', browser,
      'country', country,
      'region', region,
      'entryPage', entry_page,
      'lastPage', last_page
    ) order by last_seen desc
  ), '[]'::jsonb) into v_result
  from grouped;

  return v_result;
end;
$$;

revoke all on function public.get_web_analytics_visitors(timestamptz, timestamptz, integer)
  from public, anon;
grant execute on function public.get_web_analytics_visitors(timestamptz, timestamptz, integer)
  to authenticated;

create or replace function public.get_web_analytics_visitor_journey(
  p_visitor_hash text,
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
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_visitor_hash !~ '^[0-9a-f]{64}$'
    or p_from is null or p_to is null or p_from >= p_to
    or p_to - p_from > interval '400 days' then
    raise exception 'Invalid visitor journey filters' using errcode = '22023';
  end if;

  with selected as (
    select id, occurred_at, session_hash, event_type, page_path, click_kind,
      element_name, conversion_kind, device_type, os_type, browser_type,
      country_code, region_code
    from private_analytics.visitor_events
    where visitor_hash = p_visitor_hash
      and occurred_at >= p_from and occurred_at < p_to
    order by occurred_at desc, id desc
    limit 250
  ), totals as (
    select
      min(occurred_at) as first_seen,
      max(occurred_at) as last_seen,
      count(distinct session_hash)::bigint as sessions,
      count(*) filter (where event_type = 'page_view')::bigint as pageviews,
      count(*) filter (where event_type = 'click')::bigint as clicks,
      count(*) filter (where event_type = 'conversion')::bigint as conversions
    from private_analytics.visitor_events
    where visitor_hash = p_visitor_hash
      and occurred_at >= p_from and occurred_at < p_to
  )
  select jsonb_build_object(
    'visitorId', p_visitor_hash,
    'label', 'Visiteur ' || upper(left(p_visitor_hash, 6)),
    'summary', (select to_jsonb(totals) from totals),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'occurredAt', occurred_at,
        'sessionId', left(session_hash, 8),
        'event', event_type,
        'pagePath', page_path,
        'clickKind', click_kind,
        'element', element_name,
        'conversionKind', conversion_kind,
        'device', device_type,
        'os', os_type,
        'browser', browser_type,
        'country', country_code,
        'region', region_code
      ) order by occurred_at desc, id desc)
      from selected
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_web_analytics_visitor_journey(text, timestamptz, timestamptz)
  from public, anon;
grant execute on function public.get_web_analytics_visitor_journey(text, timestamptz, timestamptz)
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
  v_visitor_events bigint;
  v_coordinates bigint;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  update private_analytics.visitor_events
  set x_ratio = null, y_ratio = null
  where occurred_at < clock_timestamp() - interval '90 days'
    and (x_ratio is not null or y_ratio is not null);
  get diagnostics v_coordinates = row_count;

  delete from private_analytics.visitor_events
  where occurred_at < clock_timestamp() - interval '390 days';
  get diagnostics v_visitor_events = row_count;

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
  where key in ('retention', 'visitor_retention');

  return jsonb_build_object(
    'visitorEventRows', v_visitor_events,
    'coordinateRows', v_coordinates,
    'heatmapRows', v_heatmap,
    'dimensionRows', v_dimensions,
    'hourlyRows', v_hourly
  );
end;
$$;

revoke all on function public.prune_web_analytics() from public, anon;
grant execute on function public.prune_web_analytics() to authenticated;

commit;
