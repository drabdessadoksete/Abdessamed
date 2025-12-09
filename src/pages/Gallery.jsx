import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState as useState2 } from 'react'
import { getGallery } from '../services/api'
import { useTranslation } from 'react-i18next'
import implant1 from '../assets/Implantologie & Chirurgie Orale galery 1.png'
import implant2 from '../assets/Implantologie & Chirurgie Orale galery 2.png'
import implant3 from '../assets/Implantologie & Chirurgie Orale.png'
import invis1 from '../assets/Invisalign 1.png'
import invis2 from '../assets/Invisalign 2.png'
import invis3 from '../assets/Invisalign 3.png'
import invis4 from '../assets/Invisalign 4.png'
import invis5 from '../assets/Invisalign 5.png'
import invis6 from '../assets/Invisalign 6.png'
import gen1 from '../assets/Soins généraux galery 1.png'
import gen2 from '../assets/Soins généraux galery 2.png'
import gen3 from '../assets/Soins généraux galery 3.png'

function SectionCarousel({ title, badge, images, imageFit = 'cover', perImageFit }){
  const { t } = useTranslation()
  const [idx, setIdx] = useState(0)
  const startX = useRef(null)
  const moved = useRef(false)
  const containerRef = useRef(null)
  const [containerRatio, setContainerRatio] = useState(16 / 9)
  const [fits, setFits] = useState({})
  useEffect(() => {
    const updateRatio = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        if (clientWidth && clientHeight) setContainerRatio(clientWidth / clientHeight)
      }
    }
    updateRatio()
    window.addEventListener('resize', updateRatio)
    return () => window.removeEventListener('resize', updateRatio)
  }, [])
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % (images.filter(Boolean).length || 1)), 4000)
    return () => clearInterval(t)
  }, [images])
  useEffect(() => {
    if (idx >= images.filter(Boolean).length) setIdx(0)
  }, [images, idx])
  useEffect(() => setFits({}), [images])
  const prev = () => {
    const len = images.filter(Boolean).length || 1
    setIdx((v) => (v - 1 + len) % len)
  }
  const next = () => {
    const len = images.filter(Boolean).length || 1
    setIdx((v) => (v + 1) % len)
  }
  const onStart = (e) => { startX.current = e.touches ? e.touches[0].clientX : e.clientX; moved.current = false }
  const onMove = (e) => { if (startX.current != null) { const x = e.touches ? e.touches[0].clientX : e.clientX; if (Math.abs(x - startX.current) > 10) moved.current = true } }
  const onEnd = (e) => {
    if (startX.current == null) return
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const delta = endX - startX.current
    startX.current = null
    if (!moved.current) return
    if (delta > 40) prev()
    else if (delta < -40) next()
  }
  return (
    <div className="card p-6 mb-10">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h2>
        {badge && <span className="badge mt-2 inline-block">{badge}</span>}
      </div>
      <div
        className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-surface/50 relative"
        ref={containerRef}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <div className="absolute inset-0 flex transition-transform duration-500" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {images.filter(Boolean).map((src, i) => (
            <div key={i} className="min-w-full bg-surface flex items-center justify-center">
              <img
                src={src}
                alt={title}
                data-idx={i}
                className={`w-full h-full ${
                  (() => {
                    const forced = perImageFit?.[i]
                    if (forced) return forced === 'cover' || forced === 'object-cover' ? 'object-cover' : 'object-contain'
                    if (imageFit === 'auto') return fits[i] || 'object-contain'
                    return imageFit === 'contain' ? 'object-contain' : 'object-cover'
                  })()
                }`}
                loading="eager"
                onLoad={(e) => {
                  if (imageFit !== 'auto' || perImageFit?.[i]) return
                  const w = e.currentTarget.naturalWidth || 1
                  const h = e.currentTarget.naturalHeight || 1
                  const ratio = w / h
                  const nextFit = Math.abs(ratio - containerRatio) < 0.2 ? 'object-cover' : 'object-contain'
                  setFits((prev) => (prev[i] === nextFit ? prev : { ...prev, [i]: nextFit }))
                }}
              />
            </div>
          ))}
        </div>
        <button type="button" aria-label={t('gallery.prev')} onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
        <button type="button" aria-label={t('gallery.next')} onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.filter(Boolean).map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-rolexGold' : 'bg-slate-500'}`}></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Gallery(){
  const { t } = useTranslation()
  const { hash } = useLocation()
  const [dynamic, setDynamic] = useState2(null)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])
  useEffect(() => {
    getGallery().then((g) => setDynamic(g)).catch(() => setDynamic(null))
  }, [])
  return (
    <section className="section">
      <div className="container-max">
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {t('gallery.title')}
        </motion.h1>

        <div id="implant">
          <SectionCarousel
            title={t('gallery.implant')}
            images={dynamic?.implant?.map((i) => i.url) || [implant1, implant2, implant3]}
          />
        </div>

        <div id="invisalign">
          <SectionCarousel
            title={t('gallery.invisalign')}
            badge={t('gallery.badge')}
            images={dynamic?.invisalign?.map((i) => i.url) || [invis1, invis2, invis3, invis4, invis5, invis6]}
            imageFit="contain"
          />
        </div>

        <SectionCarousel
          title={t('gallery.general')}
          images={dynamic?.general?.map((i) => i.url) || [gen1, gen2, gen3]}
        />
      </div>
    </section>
  )
}
