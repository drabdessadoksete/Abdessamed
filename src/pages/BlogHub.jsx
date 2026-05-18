import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { blogPages, servicePages } from '../data/seoContent'

const blogHubImage = '/seo-images/logo-hero-section.png'

const categoryOrder = [
  'Orthodontie',
  'Orthodontie invisible',
  'Bassin de Thau / Suivi local',
]

function groupPagesByCategory() {
  const groups = new Map()

  for (const category of categoryOrder) {
    groups.set(category, [])
  }

  for (const page of blogPages) {
    const category = page.category || 'Autres articles'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(page)
  }

  return [...groups.entries()].filter(([, pages]) => pages.length)
}

export default function BlogHub() {
  const featuredOrthodontiePages = blogPages.filter((page) => page.cluster === 'orthodontie').slice(0, 6)
  const groupedPages = groupPagesByCategory()
  const essentialPages = servicePages.filter((page) => ['/orthodontie-sete', '/orthodontie-invisible-sete'].includes(page.url))

  return (
    <section className="section">
      <Helmet>
        <title>Blog dentaire Sete : orthodontie, Invisalign et implantologie</title>
        <meta
          name="description"
          content="Blog dentaire du cabinet à Sète : nouveaux articles sur l’orthodontie, l’orthodontie invisible, Invisalign et le suivi dans le Bassin de Thau."
        />
        <meta property="og:image" content="https://cabinetdentairesete.fr/seo-images/logo-hero-section.png" />
        <meta property="og:image:alt" content="Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://cabinetdentairesete.fr/seo-images/logo-hero-section.png" />
      </Helmet>

      <div className="container-max">
        <div className="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
          <div className="badge mb-4">Blog d'autorite</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Blog dentaire à Sète : orthodontie, orthodontie invisible et implantologie</h1>
          <p className="text-lg text-slate-200 max-w-4xl leading-8">
            Cette rubrique met désormais en avant un cluster complet sur l’orthodontie à Sète, l’orthodontie invisible,
            les aligneurs transparents et le suivi des patients du Bassin de Thau, avec des contenus complémentaires sur
            le prix du traitement et l’implantologie.
          </p>
          <figure className="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
            <img
              src={blogHubImage}
              alt="Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète"
              className="w-full h-[260px] md:h-[380px] object-contain bg-white p-6"
              loading="eager"
            />
          </figure>
        </div>

        <section className="grid gap-6 md:grid-cols-2 mt-10">
          {essentialPages.map((page) => (
            <Link key={page.url} to={page.url} className="card p-6 hover:-translate-y-1 transition">
              <div className="badge mb-4">{page.badge}</div>
              <h2 className="text-2xl font-bold mb-3">{page.menuLabel}</h2>
              <p className="text-slate-300 leading-7">{page.menuDescription || page.metaDescription}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="badge mb-3">Cluster prioritaire</div>
              <h2 className="text-3xl md:text-4xl font-bold">Orthodontie et alignement dentaire à Sète</h2>
            </div>
            <p className="text-slate-300 max-w-2xl leading-7">
              Les contenus les plus stratégiques sur l’orthodontie, l’orthodontie invisible et les premières questions à se poser avant un bilan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredOrthodontiePages.map((page) => (
              <Link key={page.url} to={page.url} className="card p-6 hover:-translate-y-1 transition">
                <div className="badge mb-4">{page.badge}</div>
                {(page.cardImage?.src || page.image?.src) ? (
                  <img
                    src={page.cardImage?.src || page.image.src}
                    alt={page.cardImage?.alt || page.image?.alt || page.h1}
                    className="h-20 w-20 rounded-2xl object-contain border border-rolexGold/20 bg-white/90 p-3 mb-5"
                    loading="lazy"
                  />
                ) : null}
                <h3 className="text-2xl font-bold mb-3">{page.h1}</h3>
                <p className="text-slate-300 leading-7 mb-6">{page.excerpt || page.intro}</p>
                <span className="text-rolexGold font-semibold">Lire l'article</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-10 mt-12">
          {groupedPages.map(([category, pages]) => (
            <section key={category}>
              <div className="flex items-end justify-between gap-4 mb-5">
                <h2 className="text-2xl md:text-3xl font-bold">{category}</h2>
                <div className="text-sm text-slate-400">{pages.length} article{pages.length > 1 ? 's' : ''}</div>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <Link key={page.url} to={page.url} className="card p-6 hover:-translate-y-1 transition">
                    <div className="badge mb-4">{page.badge}</div>
                {(page.cardImage?.src || page.image?.src) ? (
                      <img
                        src={page.cardImage?.src || page.image.src}
                        alt={page.cardImage?.alt || page.image?.alt || page.h1}
                        className="h-20 w-20 rounded-2xl object-contain border border-rolexGold/20 bg-white/90 p-3 mb-5"
                        loading="lazy"
                      />
                    ) : null}
                    <h3 className="text-2xl font-bold mb-3">{page.h1}</h3>
                    <p className="text-slate-300 leading-7 mb-6">{page.excerpt || page.intro}</p>
                    <span className="text-rolexGold font-semibold">Lire l'article</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
