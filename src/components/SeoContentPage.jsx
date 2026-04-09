import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { getPagesByUrls } from '../data/seoContent'

function getPrimaryImage(page, type) {
  if (page.url.includes('implant') || page.url.includes('aligner-dents-avant-implant')) {
    return {
      src: '/seo-images/implantologie-biotech-sete.png',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/implantologie-biotech-sete.png',
      alt: "Visuel d'implantologie dentaire BioTech a Sete pour illustrer la page du Dr Abdessadok",
    }
  }

  if (page.url.includes('prix')) {
    return {
      src: '/seo-images/sourire-esthetique-sete.jpg',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/sourire-esthetique-sete.jpg',
      alt: "Sourire harmonieux illustre pour une page sur le prix de l'orthodontie invisible a Sete",
    }
  }

  if (page.url.includes('bassin-de-thau') || page.url.includes('balaruc') || page.url === '/blog') {
    return {
      src: '/seo-images/dr-abdessadok-sete.jpg',
      ogSrc: 'https://cabinetdentairesete.fr/seo-images/dr-abdessadok-sete.jpg',
      alt: 'Portrait du Dr Abdessadok au cabinet dentaire de Sete',
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
  const primarySchema = buildPrimarySchema(page, type)
  const breadcrumbSchema = buildBreadcrumbSchema(page, type)
  const faqSchema = buildFaqSchema(page)
  const primaryImage = getPrimaryImage(page, type)
  const absoluteImageUrl = primaryImage.ogSrc

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
        <div className="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
          <div className="badge mb-4">{page.badge}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-5xl">{page.h1}</h1>
          <p className="text-lg text-slate-200 max-w-4xl leading-8">{page.intro}</p>
          <figure className="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
            <img
              src={primaryImage.src}
              alt={primaryImage.alt}
              className="w-full h-[260px] md:h-[380px] object-cover"
              loading="eager"
            />
          </figure>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {page.highlights.map((item) => (
              <div key={item} className="card p-5 bg-rolexGreen/20 border-rolexGold/20">
                <div className="text-sm leading-7">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-10 items-start">
          <div className="space-y-8">
            {page.sections.map((section) => (
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
            ))}

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
              <a
                href="https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret/booking/motives?specialityId=1&telehealth=false&placeId=practice-518332&bookingFunnelSource=profile"
                className="btn-primary"
              >
                {page.ctaLabel}
              </a>
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
