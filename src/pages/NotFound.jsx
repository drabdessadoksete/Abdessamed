import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section min-h-[70vh]">
      <Helmet>
        <title>Page introuvable</title>
        <meta name="description" content="Cette page n’existe pas ou n’est plus disponible." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container-max">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <span className="section-kicker mb-5">Erreur 404</span>
          <h1 className="text-4xl font-bold sm:text-5xl">Cette page est introuvable.</h1>
          <p className="mx-auto mt-5 max-w-xl text-muted">Le lien est peut-être ancien ou l’adresse comporte une erreur. Retrouvez les informations du cabinet depuis l’accueil.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">Retour à l’accueil</Link>
            <Link to="/contact/" className="btn-outline">Contacter le cabinet</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
