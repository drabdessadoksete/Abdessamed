import { Link } from 'react-router-dom'
import logo from '../assets/Favicon/android-chrome-192x192.png'
import alignTechLogo from '../assets/Align logo.png'
import invisalignLogo from '../assets/Invisalign_logo.png'
import iteroLogo from '../assets/iTero logo.jpeg'
import { useTranslation } from 'react-i18next'

const footerLinks = [
  { label: 'Pré-rendez-vous', to: '/pre-rendez-vous' },
  { label: 'Le cabinet', to: '/about' },
  { label: 'Nos soins', to: '/services' },
  { label: 'Galerie', to: '/gallery' },
  { label: 'Guides & conseils', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-12 border-t-[3px] border-rolexGold bg-[#07110d]">
      <div className="container-max grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="" aria-hidden="true" className="h-11 w-11 rounded-full object-cover ring-1 ring-rolexGold/30" />
            <span className="text-lg font-bold text-white">Cabinet Dentaire<br /><span className="text-rolexGold">Dr. Abdessadok</span></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm text-white/65">{t('footer.tagline')} Des soins modernes et une approche humaine, au cœur de Sète.</p>
          <div className="mt-6 flex w-fit flex-wrap items-center gap-4 rounded-xl bg-white/95 px-4 py-3">
            <img src={invisalignLogo} alt="Invisalign" className="h-6 w-auto object-contain" />
            <img src={alignTechLogo} alt="Align Technology" className="h-6 w-auto object-contain" />
            <img src={iteroLogo} alt="iTero" className="h-7 w-auto object-contain" />
          </div>
        </div>

        <nav aria-label="Navigation de pied de page">
          <h2 className="text-base font-bold text-white">Explorer</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            {footerLinks.map((link) => <li key={link.to}><Link to={link.to} className="transition hover:text-rolexGold">{link.label}</Link></li>)}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <h2 className="text-base font-bold text-white">{t('footer.contact')}</h2>
          <address className="mt-5 space-y-3 text-sm not-italic text-white/65">
            <a href="tel:+33422910594" className="block transition hover:text-rolexGold">04 22 91 05 94</a>
            <a href="mailto:drabdessadoksete@gmail.com" className="block break-all transition hover:text-rolexGold">drabdessadoksete@gmail.com</a>
            <p>RDC, 10 Bd Danièle Casanova<br />34200 Sète, France</p>
          </address>
        </div>

        <div>
          <h2 className="text-base font-bold text-white">{t('footer.hours')}</h2>
          <ul className="mt-5 space-y-2 text-sm text-white/65">
            <li>Lun, mar, jeu, ven<br /><span className="text-white">08:00–17:00</span></li>
            <li>Mercredi<br /><span className="text-white">08:00–12:00</span></li>
            <li>Samedi–dimanche<br /><span className="text-white">Fermé</span></li>
          </ul>
        </div>

        <div className="border-t border-white/10 pt-8 sm:col-span-2 lg:col-span-6 lg:flex lg:items-center lg:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-white/45">{t('footer.areaServedText')}</p>
          <p className="mt-4 text-xs text-white/45 lg:mt-0">{t('footer.copy', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
