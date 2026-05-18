import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { getPagesByUrls } from '../data/seoContent'
import { buildArticleBodyBlocks } from '../utils/seoArticleContent'

function getPrimaryImage(page, type) {
  if (page.heroImage?.src) {
    return {
      src: page.heroImage.src,
      ogSrc: page.heroImage.ogSrc || `https://cabinetdentairesete.fr${page.heroImage.src}`,
      alt: page.heroImage.alt || 'Illustration de la page du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.image?.src) {
    return {
      src: page.image.src,
      ogSrc: page.image.ogSrc || `https://cabinetdentairesete.fr${page.image.src}`,
      alt: page.image.alt || 'Illustration de la page du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.url.includes('implant') || page.url.includes('aligner-dents-avant-implant')) {
    return {
      src: '/seo-images/implantologie-biotech-sete.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/implantologie-biotech-sete.png',
      alt: "Visuel d'implantologie dentaire BioTech a Sete pour illustrer la page du Dr Abdessadok",
    }
  }

  if (page.url.includes('prix')) {
    return {
      src: '/seo-images/logo-hero-section.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-hero-section.png',
      alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.url.includes('bassin-de-thau') || page.url.includes('balaruc') || page.url === '/blog') {
    return {
      src: '/seo-images/logo-hero-section.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-hero-section.png',
      alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.url.includes('blog')) {
    return {
      src: '/seo-images/invisalign-sete.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/invisalign-sete.png',
      alt: "Aligneurs transparents Invisalign pour illustrer un article d'orthodontie invisible a Sete",
    }
  }

  if (page.url.includes('invisalign') || page.url.includes('orthodontie')) {
    return {
      src: '/seo-images/invisalign-sete.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/invisalign-sete.png',
      alt: "Visuel d'orthodontie invisible Invisalign pour la page du cabinet dentaire a Sete",
    }
  }

  return {
    src: '/seo-images/logo-cabinet-dentaire-sete.png',
    ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-cabinet-dentaire-sete.png',
    alt: 'Logo du cabinet dentaire Dr Abdessadok a Sete',
  }
}

function buildFaqSchema(page) {
  if (!page.faq?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function buildBreadcrumbSchema(page, type) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://cabinetdentairesete.fr/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: type === 'blog' ? 'Blog' : 'Services',
        item: `https://cabinetdentairesete.fr/${type === 'blog' ? 'blog' : 'services'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.h1,
        item: `https://cabinetdentairesete.fr${page.url}`,
      },
    ],
  }
}

function buildPrimarySchema(page, type) {
  if (type === 'blog') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: page.h1,
      description: page.metaDescription,
      mainEntityOfPage: `https://cabinetdentairesete.fr${page.url}`,
      author: {
        '@type': 'Person',
        name: 'Dr. Abdessamed Abdessadok',
      },
      publisher: {
        '@type': 'Dentist',
        name: 'Cabinet Dentaire Dr Abdessadok',
        url: 'https://cabinetdentairesete.fr/',
      },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.h1,
    description: page.metaDescription,
    url: `https://cabinetdentairesete.fr${page.url}`,
    about: {
      '@type': 'Dentist',
      name: 'Cabinet Dentaire Dr Abdessadok',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'RDC, 10 Bd Daniele Casanova',
        addressLocality: 'Sete',
        postalCode: '34200',
        addressCountry: 'FR',
      },
    },
  }
}

export default function SeoContentPage({ page, type = 'service' }) {
  const relatedPages = getPagesByUrls(page.internalLinks)
  const relatedReadingPages = getPagesByUrls(page.relatedReadingLinks)
  const primarySchema = buildPrimarySchema(page, type)
  const breadcrumbSchema = buildBreadcrumbSchema(page, type)
  const faqSchema = buildFaqSchema(page)
  const primaryImage = getPrimaryImage(page, type)
  const absoluteImageUrl = primaryImage.ogSrc
  const articleBodyBlocks = buildArticleBodyBlocks(page.articleBody)
  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: type === 'blog' ? 'Blog' : 'Services', href: type === 'blog' ? '/blog' : '/services' },
    { label: page.h1, href: page.url },
  ]

  return (
    <section className="section">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content={type === 'blog' ? 'article' : 'website'} />
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:image:alt" content={primaryImage.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:image" content={absoluteImageUrl} />
        <script type="application/ld+json">{JSON.stringify(primarySchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema ? <script type="application/ld+json">{JSON.stringify(faqSchema)}</script> : null}
      </Helmet>

      <div className="container-max">
        <nav aria-label="Fil d'ariane" className="mb-5 text-sm text-slate-300">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbItems.map((item, index) => (
              <li key={item.href} className="flex items-center gap-2">
                {index < breadcrumbItems.length - 1 ? (
                  <Link to={item.href} className="hover:text-rolexGold transition">{item.label}</Link>
                ) : (
                  <span className="text-slate-100">{item.label}</span>
                )}
                {index < breadcrumbItems.length - 1 ? <span className="text-slate-500">/</span> : null}
              </li>
            ))}
          </ol>
        </nav>

        <div className="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
          <div className="badge mb-4">{page.badge}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-5xl">{page.h1}</h1>
          <p className="text-lg text-slate-200 max-w-4xl leading-8">{page.intro}</p>
          {page.heroActions?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {page.heroActions.map((action) => {
                const baseClass =
                  action.variant === 'secondary'
                    ? 'btn-outline'
                    : action.variant === 'ghost'
                      ? 'inline-flex items-center justify-center rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-rolexGreen/20 transition'
                      : 'btn-primary'

                return (
                  <Link key={`${action.href}-${action.label}`} to={action.href} className={baseClass}>
                    {action.label}
                  </Link>
                )
              })}
            </div>
          ) : null}
          <figure className="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
            <img
              src={primaryImage.src}
              alt={primaryImage.alt}
              className="w-full h-[260px] md:h-[380px] object-cover"
              loading="eager"
            />
          </figure>
          {page.highlights?.length ? (
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {page.highlights.map((item) => (
                <div key={item} className="card p-5 bg-rolexGreen/20 border-rolexGold/20">
                  <div className="text-sm leading-7">{item}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-10 items-start">
          <div className="space-y-8">
            {page.articleBody ? (
              <section className="card p-6 md:p-8">
                <div className="space-y-5">
                  {articleBodyBlocks.map((block, index) => {
                    if (block.type === 'heading2') {
                      return <h2 key={`${block.text}-${index}`} className="text-2xl md:text-3xl font-bold pt-2">{block.text}</h2>
                    }

                    if (block.type === 'heading3') {
                      return <h3 key={`${block.text}-${index}`} className="text-xl md:text-2xl font-semibold pt-1">{block.text}</h3>
                    }

                    if (block.type === 'list') {
                      return (
                        <ul key={`list-${index}`} className="space-y-3 text-slate-200">
                          {block.items.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-rolexGold shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    }

                    if (block.type === 'quote') {
                      return (
                        <blockquote
                          key={`${block.text}-${index}`}
                          className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5 text-slate-100 italic leading-8"
                        >
                          {block.text}
                        </blockquote>
                      )
                    }

                    return <p key={`${block.text}-${index}`} className="text-slate-300 leading-8">{block.text}</p>
                  })}
                </div>
              </section>
            ) : (
              page.sections.map((section) => (
                <section key={section.heading} className="card p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.heading}</h2>
                  <div className="space-y-6">
                    {section.blocks.map((block) => (
                      <div key={block.subheading || block.paragraphs?.[0]}>
                        {block.subheading ? <h3 className="text-xl font-semibold mb-3">{block.subheading}</h3> : null}
                        <div className="space-y-4 text-slate-300 leading-8">
                          {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                        {block.bullets?.length ? (
                          <ul className="mt-4 space-y-3 text-slate-200">
                            {block.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-3">
                                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-rolexGold shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}

            {page.ctaSections?.length ? (
              <div className="space-y-6">
                {page.ctaSections.map((section) => (
                  <section
                    key={section.heading}
                    className={`rounded-[2rem] border p-6 md:p-8 ${
                      section.tone === 'gold'
                        ? 'border-rolexGold/30 bg-rolexGold/10'
                        : 'border-rolexGreen/40 bg-rolexGreen/15'
                    }`}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.heading}</h2>
                    <p className="text-slate-200 leading-8 mb-6">{section.text}</p>
                    <div className="flex flex-wrap gap-3">
                      {section.buttons.map((button, index) => (
                        <Link
                          key={`${button.href}-${button.label}`}
                          to={button.href}
                          className={index === 0 ? 'btn-primary' : 'btn-outline'}
                        >
                          {button.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}

            {relatedReadingPages.length ? (
              <section className="card p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{page.relatedReadingTitle || 'À lire aussi'}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedReadingPages.map((related) => (
                    <Link
                      key={related.url}
                      to={related.url}
                      className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5 hover:bg-rolexGreen/20 transition"
                    >
                      <div className="text-sm uppercase tracking-[0.16em] text-rolexGold">{related.badge || 'Lecture conseillée'}</div>
                      <div className="font-semibold text-lg mt-2">{related.menuLabel || related.h1}</div>
                      <div className="text-sm text-slate-300 mt-2">{related.menuDescription || related.metaDescription}</div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="card p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">FAQ</h2>
              <div className="space-y-4">
                {page.faq.map((item) => (
                  <details key={item.question} className="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5">
                    <summary className="cursor-pointer font-semibold list-none pr-6">{item.question}</summary>
                    <p className="mt-3 text-slate-300 leading-7">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-rolexGold/30 bg-rolexGold/10 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{page.ctaTitle}</h2>
              <p className="text-slate-200 leading-8 mb-6">{page.ctaText}</p>
              <Link to={page.ctaHref || '/contact'} className="btn-primary">
                {page.ctaLabel}
              </Link>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Maillage interne recommande</h2>
              <div className="space-y-3">
                {relatedPages.map((related) => (
                  <Link
                    key={related.url}
                    to={related.url}
                    className="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition"
                  >
                    <div className="font-semibold">{related.menuLabel || related.h1}</div>
                    <div className="text-sm text-slate-300 mt-1">{related.menuDescription || related.metaDescription}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Mots-cles travailles</h2>
              <div className="flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-rolexGold/20 bg-rolexGreen/10 px-3 py-1 text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
