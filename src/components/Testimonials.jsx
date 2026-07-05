import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GoogleReviews from './GoogleReviews'

const names = ['Emma L.', 'Marc D.', 'Sofia P.']

export default function Testimonials() {
  const { t } = useTranslation()
  const quotes = t('testimonials.items', { returnObjects: true })
  const reduceMotion = useReducedMotion()

  return (
    <section className="section border-y border-rolexGreen/10 bg-white" aria-labelledby="testimonials-title">
      <div className="container-max">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <span className="section-kicker mb-4">Expérience patient</span>
            <h2 id="testimonials-title" className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Des soins expliqués, une confiance qui se construit.</h2>
            <p className="mt-5 max-w-md text-slate-300">Chaque retour nous rappelle que l’écoute et la clarté comptent autant que la précision du geste.</p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-rolexGold/25 bg-rolexGold/10 px-4 py-2 text-sm font-bold text-rolexGold">
              <span aria-hidden="true">★★★★★</span>
              <span>Avis de patients</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <motion.blockquote
              className="dark-panel rounded-2xl border border-rolexGold/20 p-7 shadow-soft sm:col-span-2 md:p-9"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="quote-mark" aria-hidden="true">“</div>
              <p className="mt-3 text-xl leading-8 text-white md:text-2xl md:leading-9">{quotes[0]}</p>
              <footer className="mt-6 text-sm font-bold text-rolexGold">— {names[0]}</footer>
            </motion.blockquote>

            {quotes.slice(1).map((quote, index) => (
              <blockquote key={quote} className="card p-6">
                <p className="leading-7 text-foreground">“{quote}”</p>
                <footer className="mt-5 text-sm font-bold text-rolexGold">— {names[index + 1]}</footer>
              </blockquote>
            ))}
          </div>
        </div>
        <GoogleReviews />
      </div>
    </section>
  )
}
