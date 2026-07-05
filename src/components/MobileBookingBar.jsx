import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function MobileBookingBar({ pathname }) {
  const [visible, setVisible] = useState(false)
  const hiddenRoute = pathname.startsWith('/pre-rendez-vous') || pathname.startsWith('/login')

  useEffect(() => {
    if (hiddenRoute) {
      setVisible(false)
      return undefined
    }

    const update = () => {
      const threshold = pathname === '/' ? 420 : 120
      const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 180
      setVisible(window.scrollY > threshold && !nearBottom)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname, hiddenRoute])

  if (hiddenRoute || !visible) return null

  return (
    <div className="mobile-booking-bar lg:hidden">
      <div>
        <strong>Pré-rendez-vous</strong>
        <span>Implantologie · Orthodontie</span>
      </div>
      <div className="flex items-center gap-2">
        <a href="tel:+33422910594" className="mobile-booking-bar__phone" aria-label="Appeler le cabinet">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6.6 3.5 9 7.8 7.5 9.3c1.4 3 3.8 5.4 6.8 6.8l1.5-1.5 4.3 2.4-.7 3c-.2.8-.9 1.4-1.8 1.4C9.3 21.4 2.6 14.7 2.6 6.4c0-.9.6-1.6 1.4-1.8l2.6-1.1Z" /></svg>
        </a>
        <Link to="/pre-rendez-vous" className="mobile-booking-bar__cta">Demander <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}
