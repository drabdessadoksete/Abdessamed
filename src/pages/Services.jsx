import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage'
import { media } from '../config/media'

const generalCare = [
  ['Prévention', 'Examens de contrôle, conseils d’hygiène et prise en charge précoce des problèmes identifiés.'],
  ['Soins conservateurs', 'Traitement des lésions carieuses et restauration des dents lorsque la situation le permet.'],
  ['Prothèses dentaires', 'Étude des solutions de restauration ou de remplacement selon les dents et les tissus présents.'],
  ['Urgences', 'Évaluation des douleurs, traumatismes ou complications afin de déterminer la conduite adaptée.'],
]

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Soins dentaires, implantologie et aligneurs à Sète</title>
        <meta name="description" content="Découvrez les soins du cabinet à Sète : implantologie, orthodontie invisible, prévention, soins conservateurs et prothèses dentaires." />
      </Helmet>

      <header className="page-hero page-hero--light" aria-labelledby="services-title">
        <div className="container-max page-hero__grid">
          <div>
            <span className="section-kicker">Les soins du cabinet</span>
            <h1 id="services-title">Des parcours adaptés au besoin clinique.</h1>
          </div>
          <p>Chaque page présente le rôle du bilan, les grandes étapes et les limites à connaître. La proposition définitive dépend toujours de l’examen au cabinet.</p>
        </div>
      </header>

      <section className="authority-section authority-section--cream" aria-labelledby="services-principal-title">
        <div className="container-max">
          <div className="authority-heading">
            <span className="section-kicker">Parcours principaux</span>
            <h2 id="services-principal-title">Remplacer une dent ou étudier un alignement.</h2>
          </div>
          <div className="treatment-paths">
            <article className="treatment-path">
              <ResponsiveImage asset={media.implantDigitalPlanning} imageClassName="treatment-path__image" />
              <div className="treatment-path__body">
                <span>Implantologie</span><h3>Étudier une dent manquante.</h3>
                <p>Bilan clinique, imagerie si elle est indiquée, options de remplacement, chirurgie et suivi des suites.</p>
                <Link to="/implantologie/">Comprendre le parcours implantaire <span aria-hidden="true">→</span></Link>
              </div>
            </article>
            <article className="treatment-path">
              <ResponsiveImage asset={media.orthoTeamExplanation} imageClassName="treatment-path__image" />
              <div className="treatment-path__body">
                <span>Orthodontie invisible</span><h3>Étudier l’alignement et l’occlusion.</h3>
                <p>Examen, empreinte numérique selon le protocole, planification, port des aligneurs, contrôles et contention.</p>
                <Link to="/orthodontie-invisible-sete/">Comprendre le parcours avec aligneurs <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="authority-section" aria-labelledby="general-care-title">
        <div className="container-max editorial-grid">
          <div className="editorial-grid__intro">
            <span className="section-kicker">Soins dentaires</span>
            <h2 id="general-care-title">Prévenir, conserver et restaurer.</h2>
            <p>Les besoins courants sont pris en charge dans une logique globale, en tenant compte de la santé bucco-dentaire avant les considérations esthétiques.</p>
          </div>
          <div className="editorial-list">
            {generalCare.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="authority-section authority-section--blue">
        <div className="container-max safety-grid">
          <div><span className="section-kicker section-kicker--light">Avant le rendez-vous</span><h2>Vous ne savez pas quel parcours choisir ?</h2></div>
          <div className="safety-points">
            <article><h3>Pré-rendez-vous téléphonique</h3><p>Un échange gratuit de 5 minutes permet de préciser votre besoin et de vous orienter vers un rendez-vous adapté au cabinet.</p></article>
            <article><h3>Urgence ou douleur</h3><p>Appelez directement le cabinet au 04 22 91 05 94 pour expliquer la situation.</p></article>
            <div className="mt-6"><Link to="/pre-rendez-vous/" className="btn-accent">Déterminer mon besoin</Link></div>
          </div>
        </div>
      </section>
    </>
  )
}
