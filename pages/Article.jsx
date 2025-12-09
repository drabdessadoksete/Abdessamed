import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getArticle } from '../services/api'
import { useTranslation } from 'react-i18next'

export default function Article(){
  const { t } = useTranslation()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  useEffect(() => { getArticle(id).then(setItem).catch(() => setItem(null)) }, [id])
  if (!item) return (
    <section className="section"><div className="container-max">{t('article.loading')}</div></section>
  )
  return (
    <section className="section">
      <div className="container-max">
        <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{item.title}</motion.h1>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content_html }} />
      </div>
    </section>
  )
}
