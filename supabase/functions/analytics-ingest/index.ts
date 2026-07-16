const allowedOrigins = new Set([
  'https://cabinetdentairesete.fr',
  'https://www.cabinetdentairesete.fr',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const jsonHeaders = (origin: string | null) => ({
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://cabinetdentairesete.fr',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin',
  'Cache-Control': 'no-store',
})

const allowedEvents = new Set(['session_start', 'page_view', 'click', 'conversion'])
const allowedSources = new Set(['direct', 'google', 'bing', 'facebook', 'instagram', 'doctolib', 'newsletter', 'referral', 'campaign', 'other'])
const allowedClickKinds = new Set(['phone', 'email', 'map', 'appointment', 'contact', 'navigation', 'treatment', 'outbound', 'other'])
const allowedConversions = new Set(['contact', 'pre_appointment', 'other'])
const allowedViewports = new Set(['sm', 'md', 'lg', 'xl', 'other'])

const pick = (value: unknown, allowed: Set<string>, fallback: string) =>
  typeof value === 'string' && allowed.has(value) ? value : fallback

const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return null
  let path = value.split(/[?#]/, 1)[0] || '/'
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/{2,}/g, '/').slice(0, 180)
  if (!/^\/[A-Za-z0-9/_-]{0,179}$/.test(path)) return null
  if (path === '/admin' || path.startsWith('/admin/') || path === '/login' || path.startsWith('/login/')) return null
  return path
}

const normalizeCode = (value: unknown, pattern: RegExp, fallback = 'unknown') => {
  if (typeof value !== 'string') return fallback
  const code = value.trim().toUpperCase()
  return pattern.test(code) ? code : fallback
}

const normalizeElement = (value: unknown) => {
  if (typeof value !== 'string') return 'other'
  const element = value.trim().toLowerCase().slice(0, 64)
  return /^[a-z0-9_-]{1,64}$/.test(element) ? element : 'other'
}

const classifyUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase()
  const device = /ipad|tablet|kindle|silk/.test(ua)
    ? 'tablet'
    : /mobi|iphone|ipod|android/.test(ua)
      ? 'mobile'
      : ua ? 'desktop' : 'other'

  const os = /iphone|ipad|ipod/.test(ua)
    ? 'ios'
    : /android/.test(ua)
      ? 'android'
      : /windows/.test(ua)
        ? 'windows'
        : /cros/.test(ua)
          ? 'chromeos'
          : /macintosh|mac os x/.test(ua)
            ? 'macos'
            : /linux/.test(ua) ? 'linux' : 'other'

  const browser = /edg\//.test(ua)
    ? 'edge'
    : /samsungbrowser/.test(ua)
      ? 'samsung'
      : /firefox|fxios/.test(ua)
        ? 'firefox'
        : /chrome|crios/.test(ua)
          ? 'chrome'
          : /safari/.test(ua) ? 'safari' : 'other'

  return { device, os, browser }
}

const numberBucket = (value: unknown, maximum: number) => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > maximum) return null
  return value
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  const headers = jsonHeaders(origin)

  if (request.method === 'OPTIONS') {
    if (!origin || !allowedOrigins.has(origin)) return new Response(null, { status: 403, headers })
    return new Response(null, { status: 204, headers })
  }

  if (request.method !== 'POST' || !origin || !allowedOrigins.has(origin)) {
    return new Response(JSON.stringify({ ok: false }), { status: 403, headers })
  }

  const length = Number(request.headers.get('content-length') || 0)
  if (length > 4096) return new Response(JSON.stringify({ ok: false }), { status: 413, headers })

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers })
  }

  if (payload.consent !== true || !allowedEvents.has(String(payload.event))) {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers })
  }

  const pagePath = normalizePath(payload.pagePath)
  if (!pagePath) return new Response(JSON.stringify({ ok: false }), { status: 400, headers })

  const { device, os, browser } = classifyUserAgent(request.headers.get('user-agent') || '')
  const headerCountry = request.headers.get('cf-ipcountry')
    || request.headers.get('x-country-code')
    || request.headers.get('cloudfront-viewer-country')
  const headerRegion = request.headers.get('cf-region-code') || request.headers.get('x-region-code')

  const args = {
    p_consent: true,
    p_event: String(payload.event),
    p_page_path: pagePath,
    p_source: pick(payload.source, allowedSources, 'other'),
    p_device: device,
    p_os: os,
    p_browser: browser,
    p_country: normalizeCode(headerCountry || payload.country, /^[A-Z]{2}$/),
    p_region: normalizeCode(headerRegion || payload.region, /^[A-Z0-9-]{1,12}$/),
    p_click_kind: pick(payload.clickKind, allowedClickKinds, 'other'),
    p_element: normalizeElement(payload.element),
    p_conversion_kind: pick(payload.conversionKind, allowedConversions, 'other'),
    p_viewport: pick(payload.viewport, allowedViewports, 'other'),
    p_x_bucket: numberBucket(payload.xBucket, 19),
    p_y_bucket: numberBucket(payload.yBucket, 31),
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ ok: false }), { status: 503, headers })
  }

  try {
    const result = await fetch(`${supabaseUrl}/rest/v1/rpc/record_web_analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify(args),
    })

    if (!result.ok) return new Response(JSON.stringify({ ok: false }), { status: 502, headers })
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 502, headers })
  }
})
