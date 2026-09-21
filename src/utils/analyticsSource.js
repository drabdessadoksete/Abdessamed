export const analyticsSources = new Set(['direct', 'google', 'bing', 'facebook', 'instagram', 'doctolib', 'newsletter', 'referral', 'campaign', 'other', 'chatgpt', 'perplexity', 'gemini', 'claude', 'copilot'])

const matchesHost = (hostname, domain) => hostname === domain || hostname.endsWith(`.${domain}`)
const sourcesByHost = [
  ['chatgpt', ['chatgpt.com', 'chat.openai.com']],
  ['perplexity', ['perplexity.ai']],
  ['gemini', ['gemini.google.com']],
  ['claude', ['claude.ai']],
  ['copilot', ['copilot.microsoft.com']],
  ['google', ['google.com', 'google.fr', 'google.co.uk', 'google.de', 'google.es']],
  ['bing', ['bing.com']],
  ['facebook', ['facebook.com', 'fb.com']],
  ['instagram', ['instagram.com']],
  ['doctolib', ['doctolib.fr']],
]

// Return only a coarse allow-listed label. No URLs, prompts or queries leave here.
export function classifyAnalyticsSource({ utmSource = '', referrer = '', hostname = '' } = {}) {
  const utm = String(utmSource || '').trim().toLowerCase()
  if (utm) {
    if (analyticsSources.has(utm) && !['direct', 'other', 'referral'].includes(utm)) return utm
    if (utm === 'fb') return 'facebook'
    if (utm === 'ig') return 'instagram'
    if (['email', 'e-mail', 'mail'].includes(utm)) return 'newsletter'
    const domainSource = sourcesByHost.find(([, domains]) => domains.some((domain) => matchesHost(utm, domain)))
    return domainSource?.[0] || 'campaign'
  }
  if (!referrer) return 'direct'
  try {
    const url = new URL(referrer)
    if (!['https:', 'http:'].includes(url.protocol)) return 'other'
    if (url.hostname.replace(/^www\./, '') === hostname.toLowerCase().replace(/^www\./, '')) return 'direct'
    return sourcesByHost.find(([, domains]) => domains.some((domain) => matchesHost(url.hostname, domain)))?.[0] || 'referral'
  } catch {
    return 'other'
  }
}
