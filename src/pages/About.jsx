import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { media } from '../config/media'
import { dentistPersonSchema, site } from '../config/site'

const approach = [
  {
    title: 'Écouter la demande',
    text: 'La gêne ressentie, le contexte médical et les attentes sont distingués avant de parler de solution.',
  },
  {
    title: 'Poser une indication',
    text: 'Le bilan sert à vérifier ce qui est possible, utile ou à éviter dans votre situation.',
  },
  {
    title: 'Présenter les choix',
    text: 'Les étapes, les contraintes, les alternatives et le devis sont expliqués avant le consentement.',
  },
  {
    title: 'Organiser le suivi',
    text: 'Les contrôles et les consignes après le soin font partie du parcours dès sa planification.',
  },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>À propos du Dr Abdessadok | Cabinet dentaire Sète</title>
        <meta name="description" content="Parcours universitaire, qualifications et approche clinique du Dr Abdessamed Abdessadok, chirurgien-dentiste à Sète." />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', ...dentistPersonSchema })}</script>
      </Helmet>

      <header className="page-hero" aria-labelledby="about-title">
        <div className="container-max page-hero__grid">
          <div>
            <span className="section-kicker section-kicker--light">Le praticien et le cabinet</span>
            <h1 id="about-title">Dr Abdessamed Abdessadok</h1>
          </div>
          <p>Chirurgien-dentiste à Sète, le Dr Abdessadok inscrit l’implantologie, l’orthodontie invisible et les soins courants dans une même exigence : examiner, expliquer et suivre.</p>
        </div>
      </header>

      <section className="authority-section" aria-labelledby="about-approach-title">
        <div className="container-max editorial-grid">
          <div className="editorial-grid__intro">
            <span className="section-kicker">Une approche clinique lisible</span>
            <h2 id="about-approach-title">Comprendre le raisonnement avant d’accepter un soin.</h2>
            <p>Une page de présentation ne remplace ni un échange ni un examen. Elle doit toutefois vous permettre d’identifier clairement le praticien, son parcours et sa manière d’accompagner les décisions.</p>
          </div>
          <div className="editorial-list">
            {approach.map((item, index) => (
              <article key={item.title}>
                <span className="badge">Étape {index + 1}</span>
                <h3 className="mt-3">{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="authority-section credentials-section" aria-labelledby="about-qualifications-title">
        <div className="container-max credentials-grid">
          <div className="credentials-intro">
            <span className="section-kicker section-kicker--light">Formation</span>
            <h2 id="about-qualifications-title">Qualifications déclarées par le cabinet.</h2>
            <p>Les intitulés sont publiés sans employer les désignations réglementées de spécialiste en orthodontie ou en chirurgie orale.</p>
          </div>
          <ol className="credentials-list">
            {site.qualifications.map((qualification, index) => (
              <li key={qualification}><span>{String(index + 1).padStart(2, '0')}</span><p>{qualification}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="authority-section authority-section--cream" aria-labelledby="about-identity-title">
        <div className="container-max technology-grid">
          <ResponsiveImage asset={media.logo} className="brand-document" imageClassName="w-full bg-white object-contain p-8" />
          <div>
            <span className="section-kicker">Identité du cabinet</span>
            <h2 id="about-identity-title">Un cabinet de proximité au centre de Sète.</h2>
            <p>Le cabinet se situe au rez-de-chaussée, au 10 boulevard Danièle Casanova. Les rendez-vous cliniques ont lieu sur place et le pré-rendez-vous téléphonique sert uniquement à orienter la première demande.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact/" className="btn-primary">Adresse et horaires</Link>
              <Link to="/pre-rendez-vous/" className="btn-outline">Demander un pré-rendez-vous</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
