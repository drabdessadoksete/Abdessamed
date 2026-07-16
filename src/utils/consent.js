export const CONSENT_COOKIE = 'cabinet_cookie_choice_v1'
export const CONSENT_CHANGE_EVENT = 'cabinet:consent-change'
export const CONSENT_OPEN_EVENT = 'cabinet:consent-open'
export const ANALYTICS_VISITOR_COOKIE = 'cabinet_analytics_visitor_v1'

const ANALYTICS_VISITOR_MAX_AGE = 13 * 30 * 24 * 60 * 60
const analyticsVisitorPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const validChoices = new Set(['all', 'essential'])

export function getConsentChoice() {
  if (typeof document === 'undefined') return null
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')[1]
  return validChoices.has(value) ? value : null
}

function cookieValue(name) {
  if (typeof document === 'undefined') return null
  return document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split('=')[1] || null
}

function randomUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  if (!globalThis.crypto?.getRandomValues) return null
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function getAnalyticsVisitorId() {
  if (getConsentChoice() !== 'all') return null
  const value = cookieValue(ANALYTICS_VISITOR_COOKIE)
  return analyticsVisitorPattern.test(value || '') ? value : null
}

export function getOrCreateAnalyticsVisitorId() {
  if (typeof document === 'undefined' || getConsentChoice() !== 'all') return null
  const current = getAnalyticsVisitorId()
  if (current) return current

  const value = randomUuid()
  if (!value) return null
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${ANALYTICS_VISITOR_COOKIE}=${value}; Max-Age=${ANALYTICS_VISITOR_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  return value
}

function expireCookie(name, domain = '') {
  const domainPart = domain ? `; Domain=${domain}` : ''
  document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`
}

export function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return
  const names = document.cookie.split('; ').map((entry) => entry.split('=')[0])
  const hostname = window.location.hostname
  const rootDomain = hostname.endsWith('cabinetdentairesete.fr') ? '.cabinetdentairesete.fr' : ''

  names.filter((name) => name === '_ga' || name.startsWith('_ga_')).forEach((name) => {
    expireCookie(name)
    if (rootDomain) expireCookie(name, rootDomain)
  })

  expireCookie(ANALYTICS_VISITOR_COOKIE)
  if (rootDomain) expireCookie(ANALYTICS_VISITOR_COOKIE, rootDomain)

  try {
    window.sessionStorage.removeItem('cabinet_analytics_last_activity')
    window.sessionStorage.removeItem('cabinet_analytics_source')
    window.localStorage.removeItem('cabinet_analytics_session_v1')
    window.localStorage.removeItem('cabinet_analytics_last_activity')
  } catch {
    // Storage can be unavailable in hardened browser modes.
  }
}

export function setConsentChoice(choice) {
  if (typeof document === 'undefined' || !validChoices.has(choice)) return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`

  if (choice === 'essential') clearAnalyticsCookies()
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { choice } }))
}

export function openConsentSettings() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}

export function subscribeToConsent(callback) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => callback(getConsentChoice())
  window.addEventListener(CONSENT_CHANGE_EVENT, handler)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler)
}
