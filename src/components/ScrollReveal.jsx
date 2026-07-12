import { useEffect } from 'react'

const revealSelector = [
  'main section:not(.home-hero):not(.reviews-marquee) > .container-max',
  'main .treatment-path',
  'main .credentials-list li',
  'main .consultation-steps li',
  'main .safety-points article',
  'main .education-links a',
  'main .faq-list details',
  'main .content-disclosure',
  'main .article-section',
  'main .content-cta',
  'main [data-reveal-auto]',
].join(', ')

export default function ScrollReveal({ pathname }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const observed = new WeakSet()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    const scan = () => {
      document.querySelectorAll(revealSelector).forEach((element, index) => {
        if (observed.has(element)) return
        observed.add(element)
        element.setAttribute('data-reveal', index % 6 === 1 ? 'left' : index % 6 === 4 ? 'right' : '')
        element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`)
        observer.observe(element)
      })
    }

    let frame = window.requestAnimationFrame(scan)
    const mutations = new MutationObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(scan)
    })
    mutations.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(frame)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [pathname])

  return null
}
