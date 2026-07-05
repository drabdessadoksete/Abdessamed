import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const icons = [
  <path key="scan" d="M5 8V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3M8 12h8M12 8v8" />,
  <path key="camera" d="M5 8h3l1.2-2h5.6L16 8h3v10H5V8Zm7 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />,
  <path key="comfort" d="M7 13c1.4-3.5 2.6-5 5-5s3.6 1.5 5 5M8 16c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5M12 4v2" />,
  <path key="shield" d="M12 4 18 6v5c0 4-2.6 7-6 9-3.4-2-6-5-6-9V6l6-2Zm-2 7 1.4 1.4L15 9" />,
]

export default function Features() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })
  const reduceMotion = useReducedMotion()

  return (
    <section className="section home-section-soft" aria-labelledby="features-title">
      <div className="container-max">
        <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <span className="section-kicker mb-4">Le cabinet</span>
            <h2 id="features-title" className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{t('features.title')}</h2>
          </div>
          <p className="max-w-xl text-slate-300 md:justify-self-end">
            La technologie compte lorsqu’elle améliore réellement le diagnostic, la compréhension et le confort de vos soins.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rolexGreen/10 bg-rolexGreen/10 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {items.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="bg-surface p-7 md:min-h-[18rem] md:p-8"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rolexGold/25 bg-rolexGold/10 text-rolexGold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icons[index]}
                </svg>
              </div>
              <span className="mt-8 block text-xs font-bold tracking-[0.16em] text-rolexGold">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
