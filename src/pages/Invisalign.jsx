import { Helmet } from 'react-helmet-async'
import Services from './Services'
import { useTranslation } from 'react-i18next'

export default function Invisalign() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>Invisalign Sète : Alignement Invisible</title>
        <meta name="description" content="Orthodontie invisible Invisalign à Sète. Alignez vos dents discrètement avec le Dr Abdessadok, certifié Platinum Provider. Bilan gratuit." />
      </Helmet>
      <section className="section pb-0">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{t('invisalignPage.introTitle')}</h1>
          <p className="text-lg text-muted max-w-3xl">{t('invisalignPage.introText')}</p>
        </div>
      </section>
      <Services isSubPage={true} />
    </>
  )
}
