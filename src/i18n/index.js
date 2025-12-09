import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from '../locales/fr/common.json'
import en from '../locales/en/common.json'
import es from '../locales/es/common.json'

const saved = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'fr') : 'fr'

i18next
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      es: { translation: es },
    },
    lng: saved,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  })

export default i18next
