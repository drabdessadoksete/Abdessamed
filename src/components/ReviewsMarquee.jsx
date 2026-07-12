import { site } from '../config/site'

const reviews = [
  { name: 'Souheila Maore', text: 'Un médecin humain, compétent et bienveillant. Il prend vraiment le temps avec ses patients et donne de très bons conseils.' },
  { name: 'H EI m', text: 'Dentiste très professionnel, à l’écoute du patient. Je recommande.' },
  { name: 'Karim Bahfir', text: 'Dentiste trouvé pendant mes vacances. Je viens d’Annecy pour mes soins et je recommande vivement ce docteur.' },
  { name: 'jo gregoire', text: 'Rendez-vous en urgence dès ce matin. Docteur à l’écoute, très patient et de bons conseils.' },
  { name: 'Christel Aubeleau', text: 'Le docteur est efficace, compétent et le cabinet est nickel. Je recommande.' },
  { name: 'Josiane BAHFIR', text: 'Très bon, très humain, bons soins.' },
  { name: 'abdellah laghchim', text: 'Sérieux, appliqué et à l’écoute du patient. Je le conseille fortement.' },
]

const treatmentQuestions = {
  implantologie: [
    ['Bilan', 'Comment savoir si un implant est indiqué dans mon cas ?'],
    ['Alternatives', 'Quelles autres solutions peuvent remplacer une dent ?'],
    ['Étapes', 'Combien de rendez-vous faut-il prévoir ?'],
    ['Suites', 'Comment se déroulent la cicatrisation et les contrôles ?'],
  ],
  orthodontie: [
    ['Indication', 'Les aligneurs sont-ils adaptés à mes mouvements dentaires ?'],
    ['Quotidien', 'Combien d’heures faut-il les porter chaque jour ?'],
    ['Discrétion', 'Les taquets et les aligneurs se voient-ils ?'],
    ['Stabilité', 'Quelle contention faut-il après l’alignement ?'],
  ],
}

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card__top"><span className="review-card__initial">{review.name[0]}</span><div><strong>{review.name}</strong><small>Avis public Google · 5/5</small></div><span className="review-card__stars" aria-label="5 étoiles">★★★★★</span></div>
      <blockquote>“{review.text}”</blockquote>
    </article>
  )
}

function QuestionRail({ title, items, reverse = false }) {
  const doubled = [...items, ...items]
  return (
    <div className="question-rail">
      <p>{title}</p>
      <div className="question-rail__viewport">
        <div className={`question-rail__track ${reverse ? 'is-reverse' : ''}`}>
          {doubled.map(([label, text], index) => <article key={`${label}-${index}`} aria-hidden={index >= items.length}><span>{label}</span><strong>{text}</strong></article>)}
        </div>
      </div>
    </div>
  )
}

export default function ReviewsMarquee() {
  const doubled = [...reviews, ...reviews]
  return (
    <section className="reviews-marquee" aria-labelledby="reviews-title">
      <div className="container-max reviews-marquee__heading">
        <div><span className="section-kicker">Retours publics</span><h2 id="reviews-title">L’écoute revient dans leurs mots.</h2></div>
        <div><p>Extraits courts de retours positifs visibles sur la fiche Google du cabinet. Aucun avis n’est inventé.</p><a href={site.profiles[0]} target="_blank" rel="noopener noreferrer">Voir tous les avis sur Google <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="reviews-marquee__viewport">
        <div className="reviews-marquee__track">
          {doubled.map((review, index) => <div key={`${review.name}-${index}`} aria-hidden={index >= reviews.length}><ReviewCard review={review} /></div>)}
        </div>
      </div>
      <div className="container-max treatment-question-rails" aria-label="Questions fréquentes par parcours">
        <div className="treatment-question-rails__intro"><span>Pas de faux témoignages</span><strong>À la place, les vraies questions que chaque parcours doit clarifier.</strong></div>
        <QuestionRail title="Implantologie" items={treatmentQuestions.implantologie} />
        <QuestionRail title="Orthodontie invisible" items={treatmentQuestions.orthodontie} reverse />
      </div>
    </section>
  )
}
