import { ingestAnalytics } from '../services/analytics'
import { clearAnalyticsCookies, getConsentChoice } from './consent'

const GA_MEASUREMENT_ID = 'G-RPVFM7QQT6'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const LAST_ACTIVITY_KEY = 'cabinet_analytics_last_activity'
const SOURCE_KEY = 'cabinet_analytics_source'

const allowedEvents = new Set([
  'pre_appointment_click',
  'phone_click',
  'email_click',
  'map_click',
  'treatment_path_click',
  'language_switch',
  'form_submit',
  'form_success',
  'form_error',
  'outbound_click',
  'form_start',
])

let gaLoaded = false
let geoPromise
let lastPageKey = ''
let lastPageTime = 0

const hasAnalyticsConsent = () => getConsentChoice() === 'all'

const canonicalPath = (value = window.location.pathname) => {
  const path = String(value || '/').split(/[?#]/, 1)[0].replace(/\/{2,}/g, '/')
  return path.startsWith('/') ? path.slice(0, 180) : `/${path.slice(0, 179)}`
}

const isPrivatePath = (value) => {
  const path = canonicalPath(value)
  return path === '/login' || path.startsWith('/login/') || path === '/admin' || path.startsWith('/admin/')
}

const sanitizeParameters = (parameters) => {
  const result = {}
  const allowedKeys = new Set(['form', 'location', 'from', 'to', 'treatment', 'error_type'])
  Object.entries(parameters || {}).forEach(([key, value]) => {
    if (!allowedKeys.has(key)) return
    if (typeof value === 'string') result[key] = value.slice(0, 80)
    else if (typeof value === 'number' || typeof value === 'boolean') result[key] = value
  })
  return result
}

export function enableAnalytics() {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
  window.gtag('consent', gaLoaded ? 'update' : 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  if (gaLoaded) return

  gaLoaded = true
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
  })

  if (!document.querySelector(`script[data-cabinet-ga="${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.dataset.cabinetGa = GA_MEASUREMENT_ID
    document.head.appendChild(script)
  }
}

export function disableAnalytics() {
  if (typeof window === 'undefined') return
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
  lastPageKey = ''
  lastPageTime = 0
  clearAnalyticsCookies()
}

function detectSource() {
  try {
    const stored = window.sessionStorage.getItem(SOURCE_KEY)
    if (stored) return stored
  } catch {
    // Continue with source detection.
  }

  const params = new URLSearchParams(window.location.search)
  const utm = (params.get('utm_source') || '').toLowerCase()
  let source = 'direct'

  if (utm) {
    if (utm.includes('google')) source = 'google'
    else if (utm.includes('bing')) source = 'bing'
    else if (utm.includes('facebook') || utm === 'fb') source = 'facebook'
    else if (utm.includes('instagram') || utm === 'ig') source = 'instagram'
    else if (utm.includes('doctolib')) source = 'doctolib'
    else if (utm.includes('mail') || utm.includes('newsletter')) source = 'newsletter'
    else source = 'campaign'
  } else if (document.referrer) {
    try {
      const referrer = new URL(document.referrer)
      if (referrer.hostname !== window.location.hostname) {
        if (referrer.hostname.includes('google.')) source = 'google'
        else if (referrer.hostname.includes('bing.')) source = 'bing'
        else if (referrer.hostname.includes('facebook.')) source = 'facebook'
        else if (referrer.hostname.includes('instagram.')) source = 'instagram'
        else if (referrer.hostname.includes('doctolib.')) source = 'doctolib'
        else source = 'referral'
      }
    } catch {
      source = 'other'
    }
  }

  try { window.sessionStorage.setItem(SOURCE_KEY, source) } catch { /* no-op */ }
  return source
}

function getViewportClass() {
  const width = window.innerWidth
  if (width < 640) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1440) return 'lg'
  return 'xl'
}

async function getCoarseLocation() {
  if (!geoPromise) {
    geoPromise = fetch('/api/analytics-location', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => ({
        country: /^[A-Z]{2}$/.test(data?.country || '') ? data.country : 'unknown',
        region: /^[A-Z0-9-]{1,12}$/.test(data?.region || '') ? data.region : 'unknown',
      }))
      .catch(() => ({ country: 'unknown', region: 'unknown' }))
  }
  return geoPromise
}

async function sendAggregate(event, parameters = {}) {
  if (!hasAnalyticsConsent()) return false
  const geo = await getCoarseLocation()
  if (!hasAnalyticsConsent()) return false
  return ingestAnalytics({
    consent: true,
    event,
    pagePath: canonicalPath(parameters.pagePath),
    source: detectSource(),
    country: geo.country,
    region: geo.region,
    clickKind: parameters.clickKind || 'other',
    element: parameters.element || 'other',
    conversionKind: parameters.conversionKind || 'other',
    viewport: getViewportClass(),
    xBucket: parameters.xBucket ?? null,
    yBucket: parameters.yBucket ?? null,
  })
}

function startOrContinueSession(pagePath) {
  const now = Date.now()
  let previous = 0
  try { previous = Number(window.sessionStorage.getItem(LAST_ACTIVITY_KEY) || 0) } catch { /* no-op */ }
  if (!previous || now - previous > SESSION_TIMEOUT_MS) void sendAggregate('session_start', { pagePath })
  try { window.sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now)) } catch { /* no-op */ }
}

export function trackPageView(pathname = window.location.pathname, title = document.title) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent() || isPrivatePath(pathname)) return
  enableAnalytics()
  const pagePath = canonicalPath(pathname)
  const now = Date.now()
  if (lastPageKey === pagePath && now - lastPageTime < 1000) return
  lastPageKey = pagePath
  lastPageTime = now
  startOrContinueSession(pagePath)
  void sendAggregate('page_view', { pagePath })
  window.gtag?.('event', 'page_view', {
    page_title: String(title || '').slice(0, 120),
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
  })
}

function elementIdentity(element) {
  const explicit = element.dataset.analyticsId
  if (explicit && /^[a-z0-9_-]{1,64}$/i.test(explicit)) return explicit.toLowerCase()

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute('href') || ''
    if (href.startsWith('tel:')) return 'phone'
    if (href.startsWith('mailto:')) return 'email'
    if (/doctolib/i.test(href)) return 'doctolib'
    if (/google\.|maps\.|goo\.gl/i.test(href)) return 'map'
    try {
      const url = new URL(href, window.location.origin)
      const slug = url.pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase()
      return `link_${slug || 'home'}`.slice(0, 64)
    } catch {
      return 'link_other'
    }
  }

  if (element.getAttribute('type') === 'submit') {
    if (window.location.pathname.startsWith('/pre-rendez-vous')) return 'submit_pre_appointment'
    if (window.location.pathname.startsWith('/contact')) return 'submit_contact'
    return 'button_submit'
  }
  if (element.getAttribute('aria-label')?.toLowerCase().includes('langue')) return 'button_language'
  if (element.getAttribute('aria-controls') === 'mobile-navigation') return 'button_menu'
  return 'button_other'
}

function clickKind(element) {
  const href = element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : ''
  const analyticsId = element.dataset.analyticsId || ''
  if (/map/i.test(analyticsId)) return 'map'
  if (/appointment|rendez/i.test(analyticsId)) return 'appointment'
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('mailto:')) return 'email'
  if (/google\.|maps\.|goo\.gl/i.test(href)) return 'map'
  if (/pre-rendez-vous|doctolib/i.test(href)) return 'appointment'
  if (/contact/i.test(href) || element.getAttribute('type') === 'submit') return 'contact'
  if (/implant|orthodont|invisalign/i.test(href)) return 'treatment'
  try {
    if (href && new URL(href, window.location.origin).origin !== window.location.origin) return 'outbound'
  } catch { /* no-op */ }
  return href ? 'navigation' : 'other'
}

export function trackClick(event, pathname = window.location.pathname) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent() || isPrivatePath(pathname)) return
  const rawTarget = event.target
  if (!(rawTarget instanceof Element)) return
  const element = rawTarget.closest('a, button, [role="button"], [data-analytics-id]')
  if (!element || element.closest('[data-analytics-ignore]')) return

  const width = Math.max(document.documentElement.scrollWidth, window.innerWidth, 1)
  const height = Math.max(document.documentElement.scrollHeight, window.innerHeight, 1)
  const pageX = Number.isFinite(event.pageX) ? event.pageX : event.clientX + window.scrollX
  const pageY = Number.isFinite(event.pageY) ? event.pageY : event.clientY + window.scrollY
  const xBucket = Math.max(0, Math.min(19, Math.floor((pageX / width) * 20)))
  const yBucket = Math.max(0, Math.min(31, Math.floor((pageY / height) * 32)))

  startOrContinueSession(pathname)
  void sendAggregate('click', {
    pagePath: pathname,
    clickKind: clickKind(element),
    element: elementIdentity(element),
    xBucket,
    yBucket,
  })
}

/**
 * Sends only allow-listed, non-sensitive conversion events.
 * Names, contact details, messages and form values are never accepted.
 */
export function trackEvent(name, parameters = {}) {
  if (!allowedEvents.has(name) || typeof window === 'undefined' || !hasAnalyticsConsent()) return
  enableAnalytics()
  const safeParameters = sanitizeParameters(parameters)
  window.gtag?.('event', name, safeParameters)

  if (name === 'form_success') {
    const conversionKind = safeParameters.form === 'pre_appointment' ? 'pre_appointment' : 'contact'
    void sendAggregate('conversion', { pagePath: window.location.pathname, conversionKind })
  }
}
