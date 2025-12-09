import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getArticles } from '../services/api'
import { useTranslation } from 'react-i18next'

export default function Actualities(){
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  useEffect(() => { getArticles('published').then(setItems).catch(() => setItems([])) }, [])
  return (
    <section className="section">
      <div className="container-max">
        <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{t('nav.actualities')}</motion.h1>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((a) => (
            <Link key={a.id} to={`/actualities/${a.id}`} className="card p-6 hover:scale-[1.01] transition">
              <div className="font-semibold mb-2">{a.title}</div>
              <div className="text-xs text-muted mb-3">{new Date(a.updatedAt).toLocaleDateString()}</div>
              <div className="text-sm text-muted" dangerouslySetInnerHTML={{ __html: (a.contentHTML || '').slice(0, 200) + '…' }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
