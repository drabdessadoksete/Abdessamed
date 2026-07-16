export const CONSENT_COOKIE = 'cabinet_cookie_choice_v1'
export const CONSENT_CHANGE_EVENT = 'cabinet:consent-change'
export const CONSENT_OPEN_EVENT = 'cabinet:consent-open'

const validChoices = new Set(['all', 'essential'])

export function getConsentChoice() {
  if (typeof document === 'undefined') return null
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')[1]
  return validChoices.has(value) ? value : null
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

  try {
    window.sessionStorage.removeItem('cabinet_analytics_last_activity')
    window.sessionStorage.removeItem('cabinet_analytics_source')
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
