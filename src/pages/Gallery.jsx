import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { media } from '../config/media'
import { getGallery } from '../services/api'

const editorialImages = [
  { id: 'premier-echange', category: 'Consultation', title: 'Écouter avant de proposer', text: 'Un échange pour préciser la gêne, les priorités et les questions du patient.', asset: media.orthoFirstExchange },
  { id: 'planification-implant', category: 'Implantologie', title: 'Planifier avant d’intervenir', text: 'L’imagerie et la visualisation numérique accompagnent l’analyse du projet implantaire.', asset: media.implantDigitalPlanning },
  { id: 'scanner-adulte', category: 'Orthodontie invisible', title: 'Acquérir une empreinte numérique', text: 'Le scanner intra-oral peut soutenir l’étude de l’alignement et la préparation du suivi.', asset: media.orthoAdultScan },
  { id: 'implant-modele', category: 'Implantologie', title: 'Comprendre le remplacement d’une dent', text: 'Le modèle dentaire aide à distinguer l’implant, la restauration et les tissus voisins.', asset: media.implantCloseModel },
  { id: 'aligneurs-options', category: 'Orthodontie invisible', title: 'Choisir un dispositif adapté', text: 'Le type d’aligneur dépend des mouvements recherchés, de l’examen et du rythme de suivi.', asset: media.orthoOptions },
  { id: 'imagerie-implant', category: 'Technologie', title: 'Lire l’imagerie avec méthode', text: 'Chaque examen répond à une question clinique précise avant la planification.', asset: media.implantImaging },
  { id: 'suivi-aligneurs', category: 'Orthodontie invisible', title: 'Contrôler la progression', text: 'Les rendez-vous de suivi permettent d’observer l’adaptation et d’ajuster la suite du parcours.', asset: media.orthoFollowUp },
  { id: 'implant-manquant', category: 'Implantologie', title: 'Comparer les solutions possibles', text: 'Le remplacement d’une dent manquante se discute selon l’os, les dents voisines et les attentes.', asset: media.implantMissingTooth },
  { id: 'resultat-miroir', category: 'Consultation', title: 'Observer et expliquer', text: 'Le dialogue permet de relier le ressenti du patient aux objectifs réalistes du traitement.', asset: media.orthoMirrorResult },
  { id: 'implant-ecran', category: 'Technologie', title: 'Visualiser les étapes', text: 'Les supports numériques rendent le projet plus lisible sans remplacer l’examen clinique.', asset: media.implantScreenPlanning },
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
        <title>Galerie des parcours dentaires | Dr Abdessadok</title>
        <meta name="description" content="Découvrez en images les parcours en implantologie, orthodontie invisible et technologie dentaire proposés par le cabinet à Sète." />
      </Helmet>

      <header className="gallery-hero" aria-labelledby="gallery-title">
        <div className="container-max gallery-hero__grid">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-kicker section-kicker--light">Parcours en images</span>
            <h1 id="gallery-title">Voir pour mieux comprendre.</h1>
            <p>Des scènes pédagogiques autour de la consultation, de l’implantologie et des aligneurs pour mieux comprendre chaque étape du parcours.</p>
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
              <div className="gallery-feature__copy"><span>{featured.category}</span><h3>{featured.title}</h3><p>{featured.text}</p></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="gallery-library" aria-labelledby="gallery-library-title">
        <div className="container-max">
          <div className="gallery-library__heading"><div><span className="section-kicker">Explorer</span><h2 id="gallery-library-title">Les parcours en détail.</h2></div><p>Utilisez les filtres ou faites simplement défiler. Sur mobile, chaque scène devient une séquence plein écran facile à parcourir.</p></div>
          <div className="gallery-filters" role="group" aria-label="Filtrer la galerie">
            {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'is-active' : ''} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <motion.div layout className="editorial-gallery">
            <AnimatePresence mode="popLayout">
              {visible.map((image, index) => (
                <motion.article layout key={image.id} className={`gallery-tile gallery-tile--${index % 4}`} initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}>
                  <ResponsiveImage asset={image.asset} className="gallery-tile__visual" imageClassName="w-full h-full object-cover" />
                  <div><span>{image.category}</span><h3>{image.title}</h3><p>{image.text}</p></div>
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
