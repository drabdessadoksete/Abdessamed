import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GoogleReviews from './GoogleReviews'

const names = ['Emma L.', 'Marc D.', 'Sofia P.']

export default function Testimonials(){
  const { t } = useTranslation()
  const quotes = t('testimonials.items', { returnObjects: true })
  return (
    <section className="section">
      <div className="container-max">
        <motion.h2
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('testimonials.title')}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              className="card p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.005 }}
            >
              <p className="italic mb-4">“{q}”</p>
              <div className="text-sm text-muted">— {names[i] || 'Client'}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <GoogleReviews />
    </section>
  )
}
