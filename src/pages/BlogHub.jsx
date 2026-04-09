import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { blogPages } from '../data/seoContent'

const blogHubImage = '/seo-images/dr-abdessadok-sete.jpg'

export default function BlogHub() {
  return (
    <section className="section">
      <Helmet>
        <title>Blog dentaire Sete : guides Invisalign, prix et implantologie</title>
        <meta
          name="description"
          content="Blog dentaire du cabinet a Sete : taquets Invisalign, prix de l'orthodontie invisible et relation entre alignement dentaire et implants."
        />
        <meta property="og:image" content="https://cabinetdentairesete.fr/seo-images/dr-abdessadok-sete.jpg" />
        <meta property="og:image:alt" content="Portrait du Dr Abdessadok au cabinet dentaire de Sete" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://cabinetdentairesete.fr/seo-images/dr-abdessadok-sete.jpg" />
      </Helmet>

      <div className="container-max">
        <div className="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
          <div className="badge mb-4">Blog d'autorite</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Blog dentaire a Sete : orthodontie invisible, prix et implantologie</h1>
          <p className="text-lg text-slate-200 max-w-4xl leading-8">
            Cette rubrique rassemble les contenus d'autorite publies pour accompagner les recherches des patients autour
            d'Invisalign, de l'orthodontie invisible, du prix du traitement et de la relation entre alignement dentaire
            et implantologie.
          </p>
          <figure className="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
            <img
              src={blogHubImage}
              alt="Portrait du Dr Abdessadok au cabinet dentaire de Sete"
              className="w-full h-[260px] md:h-[380px] object-cover"
              loading="eager"
            />
          </figure>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
          {blogPages.map((page) => (
            <Link key={page.url} to={page.url} className="card p-6 hover:-translate-y-1 transition">
              <div className="badge mb-4">{page.badge}</div>
              <h2 className="text-2xl font-bold mb-3">{page.h1}</h2>
              <p className="text-slate-300 leading-7 mb-6">{page.intro}</p>
              <span className="text-rolexGold font-semibold">Lire l'article</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
