import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ResponsiveImage from '../components/ResponsiveImage'
import CTA from '../components/CTA'
import ReviewsMarquee from '../components/ReviewsMarquee'
import SmileViewSimulator from '../components/SmileViewSimulator'
import { media, mediaSlots } from '../config/media'
import { site } from '../config/site'
import { trackEvent } from '../utils/analytics'

const treatmentPaths = [
  {
    eyebrow: 'Dent manquante',
    title: 'Implantologie',
    text: 'Évaluer les tissus, l’espace disponible et les solutions de remplacement avant toute proposition de traitement.',
    href: '/implantologie/',
    link: "Comprendre le bilan implantaire",
    image: media.implantModel,
  },
  {
    eyebrow: 'Alignement dentaire',
    title: 'Orthodontie invisible',
    text: 'Étudier l’occlusion, les mouvements possibles, le port des aligneurs et la contention qui stabilise le résultat.',
    href: '/orthodontie-invisible-sete/',
    link: 'Découvrir le parcours avec aligneurs',
    image: media.orthoTeamExplanation,
  },
]

const consultationSteps = [
  ['01', 'Vous écouter', 'Votre gêne, vos attentes, vos antécédents et vos priorités sont précisés avant l’examen.'],
  ['02', 'Examiner', 'Le bilan clinique et, lorsqu’ils sont indiqués, les examens complémentaires permettent d’étudier la situation.'],
  ['03', 'Expliquer', 'Les options pertinentes, leurs limites, leur calendrier et le devis sont présentés avant toute décision.'],
  ['04', 'Suivre', 'Les rendez-vous de contrôle servent à ajuster le traitement et à accompagner les suites.'],
]

const trustPoints = [
  ['Parcours vérifiable', 'Docteur en chirurgie dentaire et formations universitaires listées sans titre de spécialiste.'],
  ['Décision partagée', 'Le temps d’expliquer les options, les contraintes et les alternatives avant le consentement.'],
  ['Cabinet local', 'Une prise en charge et un suivi au cabinet, au centre de Sète.'],
]

const faqs = [
  {
    question: 'À quoi sert le pré-rendez-vous téléphonique ?',
    answer: 'Cet échange gratuit de 5 minutes aide le cabinet à comprendre votre besoin en santé bucco-dentaire et à vous orienter vers un rendez-vous adapté sur place. Il ne remplace pas un examen clinique.',
  },
  {
    question: 'Un implant est-il toujours possible lorsqu’une dent manque ?',
    answer: 'Non. La faisabilité dépend notamment de votre santé générale, de l’examen de la bouche, du volume osseux et de la situation des dents voisines. Seul un bilan permet d’étudier les options adaptées.',
  },
  {
    question: 'Les aligneurs transparents conviennent-ils à tous les cas ?',
    answer: 'Non. Leur indication dépend des mouvements nécessaires, de l’occlusion et de la capacité à respecter le temps de port. Le bilan sert aussi à présenter d’éventuelles alternatives.',
  },
  {
    question: 'Puis-je obtenir un tarif précis avant le bilan ?',
    answer: 'Un devis fiable nécessite de connaître la situation clinique et le protocole envisagé. Le cabinet explique les postes du devis après le bilan, sans annoncer de résultat ni de tarif standard.',
  },
]

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <Helmet>
        <title>Cabinet dentaire à Sète | Dr Abdessadok</title>
        <meta name="description" content="Cabinet dentaire à Sète : implantologie, orthodontie invisible et soins expliqués avec précision par le Dr Abdessamed Abdessadok." />
        <meta property="og:image" content={`${site.url}${media.homeConsultation.fallback}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Hero />

      <ReviewsMarquee />

      <section className="trust-band" aria-labelledby="trust-title">
        <div className="container-max">
          <div className="trust-band__heading">
            <span className="section-kicker">Des repères concrets</span>
            <h2 id="trust-title">La confiance commence par des informations vérifiables.</h2>
          </div>
          <div className="trust-band__grid">
            {trustPoints.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="authority-section authority-section--cream" aria-labelledby="treatments-title">
        <div className="container-max">
          <div className="authority-heading authority-heading--split">
            <div>
              <span className="section-kicker">Deux parcours principaux</span>
              <h2 id="treatments-title">Partir de votre besoin, pas d’une solution toute faite.</h2>
            </div>
            <p>Le choix d’un traitement repose sur un examen clinique. Ces pages vous aident à préparer vos questions, sans remplacer le diagnostic.</p>
          </div>
          <div className="treatment-paths">
            {treatmentPaths.map((path) => (
              <article className="treatment-path" key={path.href}>
                <ResponsiveImage asset={path.image} imageClassName="treatment-path__image" />
                <div className="treatment-path__body">
                  <span>{path.eyebrow}</span>
                  <h3>{path.title}</h3>
                  <p>{path.text}</p>
                  <Link to={path.href} onClick={() => trackEvent('treatment_path_click', { treatment: path.href })}>{path.link} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
          <SmileViewSimulator id="home-smileview" />
        </div>
      </section>

      <section className="authority-section credentials-section" aria-labelledby="credentials-title">
        <div className="container-max credentials-grid">
          <div className="credentials-intro">
            <span className="section-kicker section-kicker--light">Le praticien</span>
            <h2 id="credentials-title">Un parcours universitaire présenté avec précision.</h2>
            <p>Les qualifications sont nommées telles qu’elles figurent dans les informations du cabinet, sans revendiquer un titre de spécialiste.</p>
            <Link to="/about/" className="text-link text-link--light">Voir le parcours et l’approche du cabinet <span aria-hidden="true">→</span></Link>
          </div>
          <ol className="credentials-list">
            {site.qualifications.map((qualification, index) => (
              <li key={qualification}><span>{String(index + 1).padStart(2, '0')}</span><p>{qualification}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="authority-section" aria-labelledby="consultation-title">
        <div className="container-max">
          <div className="authority-heading">
            <span className="section-kicker">Votre premier bilan</span>
            <h2 id="consultation-title">Savoir ce qui va se passer aide déjà à avancer sereinement.</h2>
          </div>
          <ol className="consultation-steps">
            {consultationSteps.map(([number, title, text]) => (
              <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="authority-section technology-section" aria-labelledby="technology-title">
        <div className="container-max technology-grid">
          <ResponsiveImage asset={media.clinicalTechnology} className="technology-visual" imageClassName="technology-visual__image" />
          <div>
            <span className="section-kicker">Précision numérique</span>
            <h2 id="technology-title">Des outils au service du diagnostic et de l’explication.</h2>
            <p>Le numérique peut faciliter l’acquisition d’empreintes, l’étude des volumes et la visualisation d’un projet. L’indication de chaque examen dépend de votre situation.</p>
            <ul className="check-list">
              <li>Empreinte numérique lorsqu’elle est adaptée au protocole</li>
              <li>Imagerie et planification selon les besoins du bilan</li>
              <li>Visualisation utilisée comme support d’explication, sans garantie de résultat</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="authority-section authority-section--blue" aria-labelledby="safety-title">
        <div className="container-max safety-grid">
          <div>
            <span className="section-kicker section-kicker--light">Sécurité et suivi</span>
            <h2 id="safety-title">Des protocoles lisibles avant, pendant et après le soin.</h2>
          </div>
          <div className="safety-points">
            <article><h3>Évaluation préalable</h3><p>Antécédents, traitements en cours et examens utiles sont pris en compte avant de proposer un acte.</p></article>
            <article><h3>Hygiène et traçabilité</h3><p>Le cabinet applique les protocoles d’hygiène, de stérilisation et de traçabilité adaptés aux dispositifs utilisés.</p></article>
            <article><h3>Consignes et contrôles</h3><p>Les suites attendues, les signes qui doivent amener à rappeler et les rendez-vous de contrôle sont expliqués.</p></article>
          </div>
        </div>
      </section>

      <section className="authority-section education-section" aria-labelledby="education-title">
        <div className="container-max education-grid">
          <div>
            <span className="section-kicker">Ressources patient</span>
            <h2 id="education-title">Préparer votre consultation avec des réponses nuancées.</h2>
            <p>Des guides relus avant publication, datés et reliés aux pages de soins correspondantes.</p>
          </div>
          <div className="education-links">
            <Link to="/prix-orthodontie-invisible-sete/"><span>Budget et devis</span><strong>Comprendre le prix des aligneurs</strong><b aria-hidden="true">→</b></Link>
            <Link to="/blog/aligner-dents-avant-implant/"><span>Parcours coordonné</span><strong>Aligner les dents avant un implant ?</strong><b aria-hidden="true">→</b></Link>
            <Link to="/blog/"><span>Bibliothèque</span><strong>Consulter tous les guides dentaires</strong><b aria-hidden="true">→</b></Link>
          </div>
        </div>
      </section>

      <section className="authority-section location-section" aria-labelledby="location-title">
        <div className="container-max location-grid">
          <div className="location-card">
            <span className="section-kicker section-kicker--light">Cabinet à Sète</span>
            <h2 id="location-title">Un suivi local, au 10 boulevard Danièle Casanova.</h2>
            <address>{site.address.streetAddress}<br />{site.address.postalCode} {site.address.addressLocality}</address>
            <div className="location-actions">
              <a href={`tel:${site.telephone}`} onClick={() => trackEvent('phone_click', { location: 'home_location' })}>{site.telephoneDisplay}</a>
              <Link to="/contact/">Accès et horaires</Link>
            </div>
          </div>
          <div className="location-context">
            <h3>Patients du Bassin de Thau</h3>
            <p>Le cabinet reçoit à Sète. Les pages de proximité décrivent l’accès depuis Mèze, Frontignan, Marseillan, Agde et Balaruc-les-Bains, sans prétendre à une implantation dans ces villes.</p>
            <Link to="/invisalign-bassin-de-thau/" className="text-link">Préparer votre venue depuis le Bassin de Thau <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="authority-section faq-section" aria-labelledby="home-faq-title">
        <div className="container-max faq-grid">
          <div>
            <span className="section-kicker">Questions fréquentes</span>
            <h2 id="home-faq-title">Les premières réponses, avant l’examen clinique.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      {mediaSlots.orthodontieVideo || mediaSlots.implantologieVideo ? null : null}
      <CTA />
    </>
  )
}
