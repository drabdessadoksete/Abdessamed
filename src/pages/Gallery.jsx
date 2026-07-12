import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { media } from '../config/media'
import { getGallery } from '../services/api'

const editorialImages = [
  { id: 'consultation-orthodontie', category: 'Consultation', title: 'Écouter avant de proposer', text: 'Un échange pour préciser la gêne, les priorités et les questions du patient.', asset: media.homeConsultation },
  { id: 'consultation-implantologie', category: 'Implantologie', title: 'Expliquer le remplacement d’une dent', text: 'Visualiser les solutions possibles avant de discuter le parcours clinique.', asset: media.implantConsultation },
  { id: 'scanner-intraoral', category: 'Orthodontie invisible', title: 'Numériser lorsque le protocole l’indique', text: 'L’empreinte numérique peut soutenir l’étude de l’alignement et les explications.', asset: media.intraoralScanner },
  { id: 'explication-aligneurs', category: 'Orthodontie invisible', title: 'Comprendre le rôle des aligneurs', text: 'Port quotidien, taquets, suivi et contention sont présentés avant la décision.', asset: media.alignerExplanation },
  { id: 'environnement-clinique', category: 'Technologie', title: 'Des outils au service du soin', text: 'Une illustration de l’environnement numérique, sans prétendre représenter le cabinet réel.', asset: media.clinicalTechnology },
]

const categories = ['Tous', 'Consultation', 'Implantologie', 'Orthodontie invisible', 'Technologie']

function verifiedImagesBySection(gallery) {
  if (!gallery || typeof gallery !== 'object') return []
  return Object.entries(gallery).flatMap(([section, images]) => (
    Array.isArray(images)
      ? images.filter((image) => image?.verified_documentary === true && image?.url).map((image) => ({ ...image, category: section, documentary: true }))
      : []
  ))
}

export default function Gallery() {
  const [verifiedImages, setVerifiedImages] = useState([])
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const visible = activeCategory === 'Tous' ? editorialImages : editorialImages.filter((image) => image.category === activeCategory)
  const featured = editorialImages[featuredIndex]

  useEffect(() => {
    getGallery().then((gallery) => setVerifiedImages(verifiedImagesBySection(gallery))).catch(() => setVerifiedImages([]))
  }, [])

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => setFeaturedIndex((index) => (index + 1) % editorialImages.length), 4800)
    return () => clearInterval(timer)
  }, [reduceMotion])

  return (
    <>
      <Helmet>
        <title>Galerie visuelle des parcours dentaires | Dr Abdessadok</title>
        <meta name="description" content="Galerie visuelle du cabinet dentaire à Sète : illustrations signalées des parcours en implantologie, orthodontie invisible et technologie." />
      </Helmet>

      <header className="gallery-hero" aria-labelledby="gallery-title">
        <div className="container-max gallery-hero__grid">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-kicker section-kicker--light">Parcours en images</span>
            <h1 id="gallery-title">Voir pour mieux comprendre.</h1>
            <p>Une galerie éditoriale autour des consultations, de l’implantologie et des aligneurs. Chaque image illustrative est clairement signalée et n’est jamais présentée comme une photographie réelle du cabinet.</p>
          </motion.div>
          <div className="gallery-hero__stack" aria-hidden="true">
            {editorialImages.slice(0, 3).map((image, index) => <ResponsiveImage key={image.id} asset={image.asset} className={`gallery-hero__stack-item gallery-hero__stack-item--${index}`} imageClassName="w-full h-full object-cover" />)}
          </div>
        </div>
      </header>

      <section className="gallery-feature" aria-labelledby="gallery-feature-title">
        <div className="container-max">
          <div className="gallery-feature__top"><div><span className="section-kicker">Focus automatique</span><h2 id="gallery-feature-title">Un détail à la fois.</h2></div><div><button type="button" onClick={() => setFeaturedIndex((featuredIndex - 1 + editorialImages.length) % editorialImages.length)} aria-label="Image précédente">←</button><span>{featuredIndex + 1} / {editorialImages.length}</span><button type="button" onClick={() => setFeaturedIndex((featuredIndex + 1) % editorialImages.length)} aria-label="Image suivante">→</button></div></div>
          <AnimatePresence mode="wait">
            <motion.article key={featured.id} className="gallery-feature__stage" initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.45 }}>
              <ResponsiveImage asset={featured.asset} className="gallery-feature__visual" imageClassName="w-full h-full object-cover" />
              <div className="gallery-feature__copy"><span>{featured.category}</span><h3>{featured.title}</h3><p>{featured.text}</p><small>{featured.asset.caption}</small></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="gallery-library" aria-labelledby="gallery-library-title">
        <div className="container-max">
          <div className="gallery-library__heading"><div><span className="section-kicker">Explorer</span><h2 id="gallery-library-title">Les univers du cabinet.</h2></div><p>Utilisez les filtres ou faites simplement défiler. Sur mobile, les visuels occupent davantage l’écran pour une lecture plus immersive.</p></div>
          <div className="gallery-filters" role="group" aria-label="Filtrer la galerie">
            {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'is-active' : ''} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <motion.div layout className="editorial-gallery">
            <AnimatePresence mode="popLayout">
              {visible.map((image, index) => (
                <motion.article layout key={image.id} className={`gallery-tile gallery-tile--${index % 4}`} initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}>
                  <ResponsiveImage asset={image.asset} className="gallery-tile__visual" imageClassName="w-full h-full object-cover" />
                  <div><span>{image.category}</span><h3>{image.title}</h3><p>{image.text}</p><small>Illustration éditoriale</small></div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {verifiedImages.length ? (
            <section className="verified-gallery" aria-labelledby="verified-gallery-title">
              <h2 id="verified-gallery-title">Photographies vérifiées du cabinet</h2>
              <div>{verifiedImages.map((image) => <figure key={image.id || image.url}><img src={image.url} alt={image.alt || 'Photographie vérifiée du cabinet dentaire à Sète'} loading="lazy" decoding="async" /><figcaption>{image.caption || 'Photographie du cabinet'}</figcaption></figure>)}</div>
            </section>
          ) : null}
        </div>
      </section>

      <section className="gallery-cta"><div className="container-max"><div><span className="section-kicker section-kicker--light">Parler de votre besoin</span><h2>Les images expliquent. Le bilan décide.</h2><p>Le pré-rendez-vous téléphonique permet de vous orienter vers un rendez-vous adapté au cabinet.</p><Link to="/pre-rendez-vous/" className="btn-accent">Demander un pré-rendez-vous</Link></div></div></section>
    </>
  )
}
