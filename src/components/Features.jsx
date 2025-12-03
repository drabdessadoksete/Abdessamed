import { motion } from 'framer-motion'

const features = [
  { title: 'Radiographies numériques', desc: 'Imagerie à faible radiation pour des diagnostics précis et confortables.'},
  { title: 'Caméras intraorales', desc: 'Voyez ce que nous voyons — des visuels clairs pour de meilleures décisions.'},
  { title: 'Anesthésie maîtrisée', desc: 'Techniques d’anesthésie douces pour votre confort.'},
]

export default function Features(){
  return (
    <section className="section">
      <div className="container-max">
        <h2 className="text-3xl font-bold mb-8">Pourquoi nos patients nous choisissent</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
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
