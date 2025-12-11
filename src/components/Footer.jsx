import logo from '../assets/new logo.png'
import alignTechLogo from "../assets/Align logo.png"
import invisalignLogo from "../assets/Invisalign_logo.png"
import iteroLogo from "../assets/iTero logo.jpeg"
import { useTranslation } from 'react-i18next'

export default function Footer(){
  const { t } = useTranslation()
  return (
    <footer className="mt-20 border-t border-rolexGreen/40 bg-gradient-to-t from-rolexGreen/30 to-rolexGreen/10 backdrop-blur-lg">
      <div className="container-max py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Logo du Cabinet Dentaire" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-bold">Cabinet Dentaire Dr. Abdessadok</span>
          </div>
          <p className="text-sm text-muted">{t('footer.tagline')}</p>
          <div className="mt-3 flex items-center gap-3">
            <img src={invisalignLogo} alt="Invisalign" className="h-7 w-auto object-contain" />
            <img src={alignTechLogo} alt="Align Technology" className="h-7 w-auto object-contain" />
            <img src={iteroLogo} alt="iTero" className="h-7 w-auto object-contain" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t('footer.contact')}</h4>
          <ul className="space-y-1 text-sm">
            <li>04 22 91 05 94</li>
            <li>contact@cabinetdentairesete.fr</li>
            <li>RDC, 10 Bd Danièle Casanova, 34200 Sète, France</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t('footer.hours')}</h4>
          <ul className="space-y-1 text-sm">
            <li>Lundi–Vendredi : 9:00–18:00</li>
            <li>Samedi : 9:00–13:00</li>
            <li>Dimanche : Fermé</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rolexGreen/40 py-4 text-center text-xs text-muted">
        {t('footer.copy', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
