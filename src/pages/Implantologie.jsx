import { Helmet } from 'react-helmet-async'
import Services from './Services'
import { useTranslation } from 'react-i18next'

export default function Implantologie() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>Implantologie Sète : Pose d'Implants</title>
        <meta name="description" content="Cabinet spécialisé en implantologie à Sète. Pose d'implants dentaires BioTech (Made in France) par le Dr Abdessadok. Retrouvez un sourire complet." />
      </Helmet>
      <section className="section pb-0">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{t('implantologiePage.introTitle')}</h1>
          <p className="text-lg text-muted max-w-3xl">{t('implantologiePage.introText')}</p>
        </div>
      </section>
      <Services isSubPage={true} />
    </>
  )
}
