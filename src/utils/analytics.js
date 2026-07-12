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
])

/**
 * @typedef {Record<string, string | number | boolean | undefined>} AnalyticsParameters
 */

/**
 * Sends an allow-listed event to dataLayer and GA4 when available.
 * @param {string} name
 * @param {AnalyticsParameters} parameters
 */
export function trackEvent(name, parameters = {}) {
  if (!allowedEvents.has(name) || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...parameters })

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, parameters)
  }
}
