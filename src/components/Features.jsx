import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Features(){
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })
  return (
    <section className="section">
      <div className="container-max">
        <h2 className="text-3xl font-bold mb-8">{t('features.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f, i) => (
            <motion.div
              key={i}
              className="card p-6"
              initial={{opacity:0, y:12}}
              whileInView={{opacity:1, y:0}}
              viewport={{once:true}}
              transition={{delay:i*0.05}}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="text-primary font-semibold mb-2">{f.title}</div>
              <p className="text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
