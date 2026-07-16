import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CONSENT_CHANGE_EVENT, getConsentChoice } from '../utils/consent'
import { disableAnalytics, enableAnalytics, trackClick, trackPageView } from '../utils/analytics'

export default function AnalyticsTracker({ disabled = false }) {
  const location = useLocation()
  const [choice, setChoice] = useState(() => getConsentChoice())

  useEffect(() => {
    const update = () => setChoice(getConsentChoice())
    window.addEventListener(CONSENT_CHANGE_EVENT, update)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, update)
  }, [])

  useEffect(() => {
    if (disabled) {
      disableAnalytics({ clearStorage: false })
      return undefined
    }
    if (choice !== 'all') {
      disableAnalytics()
      return undefined
    }

    enableAnalytics()
    const handleClick = (event) => trackClick(event, window.location.pathname)
    document.addEventListener('click', handleClick, { capture: true, passive: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [choice, disabled])

  useEffect(() => {
    if (choice !== 'all' || disabled) return
    const frame = window.requestAnimationFrame(() => trackPageView(location.pathname, document.title))
    return () => window.cancelAnimationFrame(frame)
  }, [choice, disabled, location.pathname])

  return null
}
