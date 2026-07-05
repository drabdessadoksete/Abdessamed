import { useEffect } from 'react'

export default function ScrollReveal({ pathname }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let observer
    let frame
    const setup = () => {
      const candidates = document.querySelectorAll(
        'main section:not(.home-hero) > .container-max, main [data-reveal-auto], main .card'
      )

      candidates.forEach((element, index) => {
        if (!element.hasAttribute('data-reveal')) element.setAttribute('data-reveal', '')
        element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`)
      })

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' })

      candidates.forEach((element) => observer.observe(element))
    }

    frame = window.requestAnimationFrame(setup)
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
