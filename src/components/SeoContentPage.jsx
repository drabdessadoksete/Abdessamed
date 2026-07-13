import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from './ResponsiveImage'
import SmileViewSimulator from './SmileViewSimulator'
import { getPagesByUrls } from '../data/seoContent'
import { buildArticleBodyBlocks } from '../utils/seoArticleContent'
import { mediaForRoute } from '../config/media'
import { absoluteUrl, dentistPersonSchema, dentistSchema, organizationSchema } from '../config/site'

function primaryAsset(page) {
  return mediaForRoute(page.url)
}

function faqSchema(page) {
  if (!page.faq?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function breadcrumbSchema(page, type) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: type === 'blog' ? 'Blog' : 'Services', item: absoluteUrl(type === 'blog' ? '/blog/' : '/services/') },
      { '@type': 'ListItem', position: 3, name: page.h1, item: absoluteUrl(page.url) },
    ],
  }
}

function primarySchema(page, type, image) {
  if (type === 'blog') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.metaDescription,
      mainEntityOfPage: absoluteUrl(page.url),
      datePublished: page.datePublished,
      dateModified: page.dateModified,
      author: { '@type': 'Organization', name: page.authorName, '@id': organizationSchema['@id'] },
      publisher: { '@id': organizationSchema['@id'] },
      image: absoluteUrl(image.fallback),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1,
    description: page.metaDescription,
    url: absoluteUrl(page.url),
    provider: { '@id': dentistSchema['@id'] },
    areaServed: page.menuGroup === 'locals' ? 'Sète et commune mentionnée pour l’accès au cabinet' : 'Sète et Bassin de Thau',
  }
}

function LongFormContent({ page }) {
  const blocks = buildArticleBodyBlocks(page.articleBody)

  if (page.articleBody) {
    return (
      <section className="article-section">
        {blocks.map((block, index) => {
          if (block.type === 'heading2') return <h2 key={`${block.text}-${index}`}>{block.text}</h2>
          if (block.type === 'heading3') return <h3 key={`${block.text}-${index}`}>{block.text}</h3>
          if (block.type === 'list') return <ul key={`list-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
          if (block.type === 'quote') return <blockquote key={`${block.text}-${index}`}>{block.text}</blockquote>
          return <p key={`${block.text}-${index}`}>{block.text}</p>
        })}
      </section>
    )
  }

  return (page.sections || []).map((section) => (
    <section className="article-section" key={section.heading}>
      <h2>{section.heading}</h2>
      {section.blocks.map((block) => (
        <div className="article-section__block" key={block.subheading || block.paragraphs?.[0]}>
          {block.subheading ? <h3>{block.subheading}</h3> : null}
          {(block.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {block.bullets?.length ? <ul>{block.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
        </div>
      ))}
    </section>
  ))
}

function TreatmentEssentials({ page }) {
  if (page.url === '/orthodontie-invisible-sete/') {
    return (
      <>
        <section className="treatment-essentials" aria-labelledby="ortho-essentials-title">
          <h2 id="ortho-essentials-title">Ce que le bilan doit clarifier</h2>
          <div>
            <article><span>01</span><h3>Indication</h3><p>Les mouvements nécessaires, l’occlusion, les tissus et les alternatives possibles.</p></article>
            <article><span>02</span><h3>Vie quotidienne</h3><p>Temps de port, retrait pendant les repas, hygiène, taquets éventuels et rendez-vous de contrôle.</p></article>
            <article><span>03</span><h3>Limites</h3><p>Un aligneur est discret, pas totalement invisible, et il ne convient pas à toutes les corrections.</p></article>
            <article><span>04</span><h3>Stabilisation</h3><p>La contention et le suivi à long terme font partie du traitement, même après l’alignement actif.</p></article>
          </div>
        </section>
        <SmileViewSimulator id="orthodontie-smileview" />
      </>
    )
  }

  if (page.url === '/implantologie/') {
    return (
      <section className="treatment-essentials" aria-labelledby="implant-essentials-title">
        <h2 id="implant-essentials-title">Les décisions prises avant la chirurgie</h2>
        <div>
          <article><span>01</span><h3>Faisabilité</h3><p>État de santé, gencives, os disponible et structures anatomiques à respecter.</p></article>
          <article><span>02</span><h3>Alternatives</h3><p>Implant, bridge, prothèse amovible ou abstention sont discutés selon la situation.</p></article>
          <article><span>03</span><h3>Chronologie</h3><p>Soins préalables, chirurgie, cicatrisation et restauration peuvent nécessiter plusieurs rendez-vous.</p></article>
          <article><span>04</span><h3>Maintenance</h3><p>Hygiène, contrôles et gestion des facteurs de risque contribuent au suivi sans garantie de durée.</p></article>
        </div>
      </section>
    )
  }

  return null
}

export default function SeoContentPage({ page, type = 'service' }) {
  const relatedPages = getPagesByUrls(page.internalLinks).filter((related) => related.url !== page.url)
  const asset = primaryAsset(page)
  const isArticle = type === 'blog'
  const isCityPage = page.menuGroup === 'locals'
  const isInvisalignBrandPage = page.url === '/invisalign/'
  const schemas = [primarySchema(page, type, asset), breadcrumbSchema(page, type), faqSchema(page)].filter(Boolean)

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content={isArticle ? 'article' : 'website'} />
        <meta property="og:image" content={absoluteUrl(asset.fallback)} />
        <meta property="og:image:alt" content={asset.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        {isArticle ? <meta property="article:published_time" content={page.datePublished} /> : null}
        {isArticle ? <meta property="article:modified_time" content={page.dateModified} /> : null}
        {schemas.map((schema, index) => <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>)}
      </Helmet>

      <header className="content-hero">
        <div className="container-max">
          <nav aria-label="Fil d’Ariane" className="content-breadcrumb">
            <Link to="/">Accueil</Link><span>/</span><Link to={isArticle ? '/blog/' : '/services/'}>{isArticle ? 'Guides' : 'Soins'}</Link><span>/</span><span aria-current="page">{page.menuLabel || page.h1}</span>
          </nav>
          <div className="content-hero__grid">
            <div className="content-hero__copy">
              <span className="section-kicker section-kicker--light">{page.badge || (isArticle ? 'Guide patient' : 'Parcours de soin')}</span>
              <h1>{page.h1}</h1>
              <p>{page.intro}</p>
              <div className="content-hero__actions">
                <Link to="/pre-rendez-vous/" className="btn-accent">Demander un pré-rendez-vous</Link>
                <Link to="/contact/" className="btn-light">Contacter le cabinet</Link>
              </div>
            </div>
            <ResponsiveImage asset={asset} eager className="content-hero__visual" imageClassName="content-hero__image" />
          </div>
        </div>
      </header>

      {isArticle ? (
        <div className="article-byline">
          <div className="container-max">
            <span>Par {page.authorName}</span>
            <span>Publié le {new Date(page.datePublished).toLocaleDateString('fr-FR')}</span>
            <span>Mis à jour le {new Date(page.dateModified).toLocaleDateString('fr-FR')}</span>
            <strong>Relecture clinique : en attente</strong>
          </div>
        </div>
      ) : null}

      <section className="authority-section content-main" id="content-article">
        <div className="container-max">
          {isCityPage ? (
            <aside className="content-disclosure">
              <strong>Le cabinet se situe à Sète.</strong>
              <p>Cette page aide à préparer le déplacement depuis la commune mentionnée. Elle ne correspond pas à une adresse secondaire du cabinet et reste en attente d’une comparaison Search Console avant toute décision de consolidation.</p>
            </aside>
          ) : null}

          {isInvisalignBrandPage ? (
            <aside className="content-disclosure">
              <strong>Le rôle distinct de cette page</strong>
              <p>Cette page décrit spécifiquement la solution de marque Invisalign et son protocole. La page <Link to="/orthodontie-invisible-sete/">orthodontie invisible à Sète</Link> traite plus largement de l’indication clinique des aligneurs, quelle que soit la marque retenue.</p>
            </aside>
          ) : null}

          <TreatmentEssentials page={page} />

          <div className="content-layout">
            <article className="content-article">
              {page.highlights?.length ? (
                <section className="content-summary" aria-labelledby="summary-title">
                  <h2 id="summary-title">À retenir</h2>
                  <ul>{page.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ) : null}

              <LongFormContent page={page} />

              {page.faq?.length ? (
                <section className="article-section faq-list" aria-labelledby="content-faq-title">
                  <h2 id="content-faq-title">Questions fréquentes</h2>
                  {page.faq.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
                </section>
              ) : null}

              <section className="content-cta">
                <span className="section-kicker section-kicker--light">Prochaine étape</span>
                <h2>{page.ctaTitle}</h2>
                <p>{page.ctaText}</p>
                <Link to={page.ctaHref || '/pre-rendez-vous/'} className="btn-accent">{page.ctaLabel}</Link>
              </section>
            </article>

            <aside className="content-aside" aria-label="Ressources associées">
              <div>
                <h2>Poursuivre votre lecture</h2>
                {relatedPages.slice(0, 6).map((related) => (
                  <Link key={related.url} to={related.url}><span>{related.badge || 'Guide'}</span><strong>{related.menuLabel || related.h1}</strong></Link>
                ))}
              </div>
              <div className="content-aside__note">
                <h2>À propos de ces informations</h2>
                <p>Le contenu informe et prépare les questions. Il ne permet ni diagnostic à distance, ni garantie de résultat.</p>
                <Link to="/about/">Parcours du praticien →</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
