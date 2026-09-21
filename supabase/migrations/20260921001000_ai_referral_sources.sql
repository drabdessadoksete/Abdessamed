-- Adds coarse AI referral labels to both existing analytics ingestion functions.
-- Signatures, consent checks, permissions, retention and aggregation remain unchanged.
-- Apply before deploying the updated analytics-ingest Edge Function and frontend.
begin;

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
    'newsletter', 'referral', 'campaign', 'other',
    'chatgpt', 'perplexity', 'gemini', 'claude', 'copilot'
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
    'newsletter', 'referral', 'campaign', 'other',
    'chatgpt', 'perplexity', 'gemini', 'claude', 'copilot'
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

commit;
