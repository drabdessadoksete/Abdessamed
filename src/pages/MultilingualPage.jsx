import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { getAlternatesForPageType, multilingualRouteByPath } from '../config/multilingualRoutes'
import { media } from '../config/media'
import { absoluteUrl, dentistSchema, site } from '../config/site'

export default function MultilingualPage() {
  const { pathname } = useLocation()
  const route = multilingualRouteByPath.get(pathname.endsWith('/') ? pathname : `${pathname}/`)
  if (!route) return null

  const asset = route.pageType === 'implant' ? media.implantDigitalPlanning : route.pageType === 'ortho' ? media.orthoTeamExplanation : media.homeConsultation
  const alternates = getAlternatesForPageType(route.pageType)
  const schemaType = route.pageType === 'contact' ? 'ContactPage' : route.pageType === 'home' ? 'WebPage' : 'Service'
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: route.h1,
    description: route.description,
    url: absoluteUrl(route.path),
    inLanguage: route.language,
    ...(schemaType === 'Service' ? { provider: { '@id': dentistSchema['@id'] }, areaServed: 'Sète, France' } : {}),
    ...(schemaType === 'ContactPage' ? { mainEntity: { '@id': dentistSchema['@id'] } } : {}),
  }

  return (
    <>
      <Helmet htmlAttributes={{ lang: route.language }}>
        <title>{route.title}</title>
        <meta name="description" content={route.description} />
        <meta property="og:title" content={route.title} />
        <meta property="og:description" content={route.description} />
        <meta property="og:image" content={absoluteUrl(asset.fallback)} />
        {alternates.map((alternate) => <link key={alternate.language} rel="alternate" hrefLang={alternate.language} href={absoluteUrl(alternate.href)} />)}
        <link rel="alternate" hrefLang="x-default" href={absoluteUrl('/')} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <header className="localized-hero" lang={route.language}>
        <div className="container-max localized-hero__grid">
          <div>
            <span className="section-kicker section-kicker--light">{route.eyebrow}</span>
            <h1>{route.h1}</h1>
            <p>{route.intro}</p>
            <Link to={route.paths.contact} className="btn-accent">{route.labels.cta}</Link>
          </div>
          <ResponsiveImage asset={asset} eager className="localized-hero__visual" imageClassName="localized-hero__image" />
        </div>
      </header>

      <aside className="language-disclosure" lang={route.language}>
        <div className="container-max"><strong>{route.label}</strong><p>{route.notice}</p></div>
      </aside>

      <section className="authority-section localized-content" lang={route.language}>
        <div className="container-max">
          <div className="localized-content__grid">
            {route.sections.map((section, index) => (
              <article key={section.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
                {section.linkType ? <Link to={route.paths[section.linkType]}>{route.labels.learn} →</Link> : null}
              </article>
            ))}
          </div>
          <div className="localized-practical">
            <div><span>{site.telephoneDisplay}</span><strong>{site.address.streetAddress}, {site.address.postalCode} {site.address.addressLocality}</strong></div>
            <Link to={route.paths.contact}>{route.labels.contact} →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
