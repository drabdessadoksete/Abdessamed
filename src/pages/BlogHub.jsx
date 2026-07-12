import { useDeferredValue, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { blogPages } from '../data/seoContent'
import { media } from '../config/media'

const categories = ['Tous', 'Implantologie', 'Orthodontie', 'Orthodontie invisible', 'Bassin de Thau / Suivi local']

function articleCategory(page) {
  return page.category || (page.cluster === 'implantologie' ? 'Implantologie' : 'Orthodontie invisible')
}

function articleAsset(page) {
  if (page.cluster === 'implantologie' || page.url.includes('implant')) return media.implantConsultation
  if (page.url.includes('quotidien') || page.url.includes('premier-bilan')) return media.alignerExplanation
  return media.intraoralScanner
}

export default function BlogHub() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const deferredCategory = useDeferredValue(activeCategory)
  const reduceMotion = useReducedMotion()
  const featured = blogPages.filter((page) => page.cluster === 'implantologie').slice(0, 5)
  const visibleArticles = deferredCategory === 'Tous' ? blogPages : blogPages.filter((page) => articleCategory(page) === deferredCategory)
  const current = featured[featuredIndex]

  useEffect(() => {
    if (reduceMotion || featured.length < 2) return undefined
    const timer = setInterval(() => setFeaturedIndex((index) => (index + 1) % featured.length), 5600)
    return () => clearInterval(timer)
  }, [featured.length, reduceMotion])

  return (
    <>
      <Helmet>
        <title>Guides dentaires à Sète | Implantologie et orthodontie</title>
        <meta name="description" content="Guides patients du cabinet à Sète sur les implants dentaires, l’orthodontie invisible, les aligneurs et la préparation du premier bilan." />
      </Helmet>

      <header className="guides-hero" aria-labelledby="blog-title">
        <div className="guides-hero__orb" aria-hidden="true" />
        <div className="container-max guides-hero__grid">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="section-kicker section-kicker--light">Bibliothèque patient</span>
            <h1 id="blog-title">Comprendre avant votre rendez-vous.</h1>
            <p>Des guides illustrés pour préparer vos questions sur les implants, les aligneurs et le suivi. Chaque article distingue ce qui est général de ce qui nécessite un examen.</p>
            <div className="guides-hero__stats"><div><strong>{blogPages.length}</strong><span>guides disponibles</span></div><div><strong>2</strong><span>parcours principaux</span></div><div><strong>4</strong><span>langues d’information</span></div></div>
          </motion.div>
          <ResponsiveImage asset={media.implantConsultation} eager showCaption className="guides-hero__visual" imageClassName="guides-hero__image" />
        </div>
      </header>

      <section className="featured-guides" aria-labelledby="featured-guides-title">
        <div className="container-max">
          <div className="featured-guides__heading"><div><span className="section-kicker">À découvrir</span><h2 id="featured-guides-title">Le dossier implantologie.</h2></div><div className="featured-guides__controls"><button type="button" aria-label="Guide précédent" onClick={() => setFeaturedIndex((featuredIndex - 1 + featured.length) % featured.length)}>←</button><span>{String(featuredIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span><button type="button" aria-label="Guide suivant" onClick={() => setFeaturedIndex((featuredIndex + 1) % featured.length)}>→</button></div></div>

          <div className="featured-guides__stage">
            <AnimatePresence mode="wait">
              <motion.article key={current.url} initial={reduceMotion ? false : { opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -25 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
                <ResponsiveImage asset={articleAsset(current)} className="featured-guides__image" imageClassName="w-full h-full object-cover" />
                <div className="featured-guides__copy">
                  <div className="blog-card__meta"><span>{articleCategory(current)}</span><span>{new Date(current.dateModified).toLocaleDateString('fr-FR')}</span></div>
                  <h3>{current.h1}</h3>
                  <p>{current.excerpt || current.intro}</p>
                  <Link to={current.url} className="btn-accent">Lire ce guide <span aria-hidden="true">→</span></Link>
                </div>
              </motion.article>
            </AnimatePresence>
            <div className="featured-guides__progress" aria-hidden="true">{featured.map((page, index) => <button key={page.url} type="button" className={index === featuredIndex ? 'is-active' : ''} onClick={() => setFeaturedIndex(index)} />)}</div>
          </div>
        </div>
      </section>

      <section className="guides-library" aria-labelledby="guides-library-title">
        <div className="container-max">
          <div className="guides-library__heading"><div><span className="section-kicker">Tous les sujets</span><h2 id="guides-library-title">Choisissez votre question.</h2></div><p>Filtrez les contenus par parcours. Les cartes se réorganisent sans recharger la page.</p></div>
          <div className="guides-filters" role="group" aria-label="Filtrer les guides par thème">
            {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'is-active' : ''} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <motion.div layout className="blog-card-grid">
            <AnimatePresence mode="popLayout">
              {visibleArticles.map((page, index) => <ArticleCard key={page.url} page={page} index={index} reduceMotion={reduceMotion} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function ArticleCard({ page, index, reduceMotion }) {
  return (
    <motion.article
      layout
      className={`blog-card blog-card--${index % 3}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.34, delay: Math.min(index, 5) * 0.035 }}
    >
      <div className="blog-card__number">{String(index + 1).padStart(2, '0')}</div>
      <div className="blog-card__meta"><span>{articleCategory(page)}</span><span>{new Date(page.dateModified).toLocaleDateString('fr-FR')}</span></div>
      <h3><Link to={page.url}>{page.h1}</Link></h3>
      <p>{page.excerpt || page.intro}</p>
      <div className="blog-card__footer"><Link to={page.url}>Lire le guide <span aria-hidden="true">→</span></Link><small>Information générale</small></div>
    </motion.article>
  )
}
