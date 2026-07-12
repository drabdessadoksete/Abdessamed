import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import logo from '../assets/Favicon/android-chrome-192x192.png'
import {
  addGalleryItem,
  createService,
  deleteAppointment,
  deleteGalleryItem,
  deleteMessage,
  deleteService,
  getAppointments,
  getGallery,
  getMessages,
  getServices,
  logoutAdmin,
  updateAppointmentStatus,
  updateService,
} from '../services/api'

const panelClass = 'rounded-[1.4rem] border border-[#dfe7e2] bg-white shadow-[0_18px_55px_rgba(28,49,42,.07)]'
const inputClass = 'w-full rounded-xl border border-[#d8e1dc] bg-[#fbfcfa] px-3.5 py-3 text-sm text-[#17231f] outline-none transition placeholder:text-[#8b9792] focus:border-[#856938] focus:ring-4 focus:ring-[#856938]/10'
const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#214e3e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#173d30] disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d8e1dc] bg-white px-3.5 py-2 text-sm font-bold text-[#263a33] transition hover:border-[#b7c8c0] hover:bg-[#f7f9f7]'

const iconPaths = {
  overview: <><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-12h6V4h-6v4Z" /></>,
  appointments: <><path d="M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m9 15 2 2 4-5" /></>,
  messages: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /><path d="M8 9h8M8 13h5" /></>,
  services: <><path d="M4 7h16M7 3v4M17 3v4M6 11h4v4H6zM14 11h4v4h-4zM6 18h4M14 18h4" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 15-5-5L5 20" /></>,
  articles: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h5M8 12h8M8 16h8" /></>,
  external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  refresh: <><path d="M20 6v5h-5M4 18v-5h5" /><path d="M6.1 9A7 7 0 0 1 18.5 6L20 11M4 13l1.5 5A7 7 0 0 0 18 15" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  edit: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14 7 3 3" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
}

function Icon({ name, className = 'h-5 w-5' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{iconPaths[name]}</svg>
}

const navigation = [
  { key: 'overview', label: 'Vue d’ensemble', icon: 'overview' },
  { key: 'appointments', label: 'Pré-rendez-vous', icon: 'appointments', countKey: 'appointments' },
  { key: 'messages', label: 'Messages', icon: 'messages', countKey: 'messages' },
  { key: 'services', label: 'Services', icon: 'services' },
  { key: 'gallery', label: 'Galerie', icon: 'gallery' },
]

const pageMeta = {
  overview: { eyebrow: 'Tableau de bord', title: 'Bonjour, bienvenue au cabinet', description: 'Retrouvez l’essentiel de l’activité du site en un coup d’œil.' },
  appointments: { eyebrow: 'Patients', title: 'Pré-rendez-vous', description: 'Traitez les nouvelles demandes et suivez chaque rappel.' },
  messages: { eyebrow: 'Patients', title: 'Messages', description: 'Consultez les demandes envoyées depuis le formulaire de contact.' },
  services: { eyebrow: 'Contenu', title: 'Services', description: 'Mettez à jour les soins présentés sur le site.' },
  gallery: { eyebrow: 'Contenu', title: 'Galerie', description: 'Organisez les visuels du cabinet par spécialité.' },
}

const handleLogout = async () => {
  await logoutAdmin()
  window.location.href = '/login'
}

export default function Admin() {
  const [tab, setTab] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [counts, setCounts] = useState({ appointments: 0, messages: 0 })
  const meta = pageMeta[tab]

  const refreshCounts = async () => {
    try {
      const [appointments, messages] = await Promise.all([getAppointments(), getMessages()])
      setCounts({ appointments: appointments.filter((item) => item.status === 'new').length, messages: messages.length })
    } catch {
      // The individual pages display actionable errors.
    }
  }

  useEffect(() => { refreshCounts() }, [])

  const navigate = (key) => {
    setTab(key)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f6f3] font-sans text-[#17231f]">
      <AnimatePresence>
        {menuOpen && <motion.button type="button" aria-label="Fermer le menu" className="fixed inset-0 z-40 bg-[#0d261e]/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col bg-[#173d30] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Retour au site">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"><img src={logo} alt="" className="h-8 w-8 rounded-full" /></span>
            <span className="min-w-0"><strong className="block truncate text-sm">Cabinet Abdessadok</strong><span className="mt-0.5 block text-xs text-white/60">Espace administration</span></span>
          </Link>
          <button type="button" className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMenuOpen(false)}><Icon name="close" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[.65rem] font-black uppercase tracking-[.2em] text-[#d8c59c]/60">Gestion</p>
          <nav className="mt-3 space-y-1.5">
            {navigation.slice(0, 3).map((item) => <NavButton key={item.key} item={item} active={tab === item.key} count={counts[item.countKey]} onClick={() => navigate(item.key)} />)}
          </nav>
          <p className="mt-8 px-3 text-[.65rem] font-black uppercase tracking-[.2em] text-[#d8c59c]/60">Site & contenu</p>
          <nav className="mt-3 space-y-1.5">
            {navigation.slice(3).map((item) => <NavButton key={item.key} item={item} active={tab === item.key} onClick={() => navigate(item.key)} />)}
            <Link to="/admin/actualities" className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"><Icon name="articles" className="h-[1.15rem] w-[1.15rem]" /><span className="flex-1">Actualités</span><Icon name="chevron" className="h-4 w-4 opacity-40 transition group-hover:translate-x-0.5" /></Link>
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"><Icon name="external" className="h-[1.15rem] w-[1.15rem]" />Voir le site public</Link>
          <button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-red-300/10 hover:text-red-100"><Icon name="logout" className="h-[1.15rem] w-[1.15rem]" />Déconnexion</button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[18rem]">
        <header className="sticky top-0 z-30 border-b border-[#dfe7e2]/90 bg-[#f4f6f3]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" aria-label="Ouvrir le menu" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#dbe4df] bg-white text-[#214e3e] lg:hidden" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
              <div className="min-w-0"><p className="text-[.65rem] font-black uppercase tracking-[.18em] text-[#856938]">{meta.eyebrow}</p><h1 className="truncate text-lg font-bold sm:text-xl">{meta.title}</h1></div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" aria-label="Voir le site" className="hidden h-11 items-center gap-2 rounded-xl border border-[#dbe4df] bg-white px-4 text-sm font-bold text-[#263a33] transition hover:border-[#b9c9c1] sm:flex"><Icon name="external" className="h-4 w-4" />Voir le site</Link>
              <button type="button" onClick={handleLogout} aria-label="Se déconnecter" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#dbe4df] bg-white text-[#52635c] transition hover:border-red-200 hover:text-red-600"><Icon name="logout" className="h-[1.1rem] w-[1.1rem]" /></button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[100rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          <div className="mb-7"><p className="max-w-2xl text-sm leading-6 text-[#68766f]">{meta.description}</p></div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>
              {tab === 'overview' && <OverviewAdmin onNavigate={navigate} />}
              {tab === 'appointments' && <AppointmentsAdmin onChanged={refreshCounts} />}
              {tab === 'messages' && <MessagesAdmin onChanged={refreshCounts} />}
              {tab === 'services' && <ServicesAdmin />}
              {tab === 'gallery' && <GalleryAdmin />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function NavButton({ item, active, count, onClick }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active ? 'bg-white text-[#173d30] shadow-lg shadow-black/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon name={item.icon} className="h-[1.15rem] w-[1.15rem]" /><span className="flex-1">{item.label}</span>{count > 0 && <span className={`min-w-6 rounded-full px-2 py-0.5 text-center text-[.68rem] font-black ${active ? 'bg-[#214e3e] text-white' : 'bg-[#d8c59c] text-[#173d30]'}`}>{count}</span>}</button>
}

function SectionHeading({ title, description, action }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-bold tracking-[-.02em] sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-sm text-[#718079]">{description}</p>}</div>{action}</div>
}

function EmptyState({ icon, title, description }) {
  return <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd8d1] bg-[#fafbf9] p-7 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ed] text-[#214e3e]"><Icon name={icon} /></span><strong className="mt-4">{title}</strong><p className="mt-1 max-w-sm text-sm text-[#718079]">{description}</p></div>
}

function OverviewAdmin({ onNavigate }) {
  const [state, setState] = useState({ loading: true, appointments: [], messages: [], services: [], galleryCount: 0 })
  const [error, setError] = useState('')

  const refresh = async () => {
    setError('')
    try {
      const [appointments, messages, services, gallery] = await Promise.all([getAppointments(), getMessages(), getServices(), getGallery()])
      setState({ loading: false, appointments, messages, services, galleryCount: Object.values(gallery).flat().length })
    } catch {
      setState((current) => ({ ...current, loading: false }))
      setError('Certaines données du tableau de bord n’ont pas pu être chargées.')
    }
  }

  useEffect(() => { refresh() }, [])
  const newAppointments = state.appointments.filter((item) => item.status === 'new')
  const stats = [
    { label: 'Nouveaux pré-RDV', value: newAppointments.length, icon: 'appointments', tone: 'bg-[#edf4f0] text-[#214e3e]', action: 'appointments' },
    { label: 'Messages reçus', value: state.messages.length, icon: 'messages', tone: 'bg-[#f5f0e5] text-[#856938]', action: 'messages' },
    { label: 'Services publiés', value: state.services.length, icon: 'services', tone: 'bg-[#edf1f5] text-[#476274]', action: 'services' },
    { label: 'Images en galerie', value: state.galleryCount, icon: 'gallery', tone: 'bg-[#f3edf4] text-[#745578]', action: 'gallery' },
  ]

  return <div className="space-y-7">
    {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => <button key={stat.label} type="button" onClick={() => onNavigate(stat.action)} className={`${panelClass} group flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#c8d5ce]`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.tone}`}><Icon name={stat.icon} /></span><span><span className="block text-3xl font-black tracking-[-.05em]">{state.loading ? '—' : stat.value}</span><span className="mt-0.5 block text-xs font-bold text-[#718079]">{stat.label}</span></span><Icon name="chevron" className="ml-auto h-4 w-4 text-[#a8b4ae] transition group-hover:translate-x-0.5" /></button>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
      <section className={`${panelClass} p-5 sm:p-7`}>
        <SectionHeading title="Demandes récentes" description="Les derniers patients à rappeler." action={<button type="button" className={secondaryButton} onClick={() => onNavigate('appointments')}>Tout afficher <Icon name="chevron" className="h-4 w-4" /></button>} />
        <div className="mt-6 space-y-3">
          {state.loading ? <p className="py-10 text-center text-sm text-[#718079]">Chargement…</p> : state.appointments.length === 0 ? <EmptyState icon="appointments" title="Aucune demande" description="Les demandes envoyées depuis le site apparaîtront ici." /> : state.appointments.slice(0, 4).map((item) => <button type="button" key={item.id} onClick={() => onNavigate('appointments')} className="flex w-full items-center gap-3 rounded-2xl border border-[#e4eae6] p-4 text-left transition hover:border-[#c9d6cf] hover:bg-[#fafbf9]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf1ed] text-sm font-black text-[#214e3e]">{item.name?.charAt(0)?.toUpperCase()}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.name}</strong><span className="mt-0.5 block truncate text-xs text-[#718079]">{getAppointmentSpecialtyLabel(item.specialty)} · {formatDate(item.created_at)}</span></span><StatusBadge status={item.status} compact /><Icon name="chevron" className="h-4 w-4 text-[#a8b4ae]" /></button>)}
        </div>
      </section>

      <aside className={`${panelClass} overflow-hidden`}>
        <div className="bg-[#214e3e] p-6 text-white"><p className="text-[.65rem] font-black uppercase tracking-[.18em] text-[#d8c59c]">Accès rapide</p><h2 className="mt-2 text-xl font-bold">Gérer le site</h2><p className="mt-2 text-sm leading-6 text-white/60">Les actions les plus fréquentes, sans chercher dans les menus.</p></div>
        <div className="space-y-2 p-4">
          {[['appointments', 'appointments', 'Traiter les pré-rendez-vous'], ['messages', 'messages', 'Lire les messages'], ['services', 'services', 'Modifier les services'], ['gallery', 'gallery', 'Ajouter une image']].map(([key, icon, label]) => <button key={key} type="button" onClick={() => onNavigate(key)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-bold transition hover:bg-[#f3f6f4]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3f0] text-[#214e3e]"><Icon name={icon} className="h-[1.05rem] w-[1.05rem]" /></span><span className="flex-1">{label}</span><Icon name="chevron" className="h-4 w-4 text-[#9ba8a2]" /></button>)}
        </div>
      </aside>
    </div>
  </div>
}

const appointmentStatuses = {
  new: { label: 'Nouveau', className: 'border-amber-200 bg-amber-50 text-amber-800' },
  contacted: { label: 'Contacté', className: 'border-sky-200 bg-sky-50 text-sky-800' },
  scheduled: { label: 'RDV fixé', className: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  closed: { label: 'Clôturé', className: 'border-slate-200 bg-slate-50 text-slate-600' },
}

const appointmentSpecialties = {
  'pre-rendez-vous-telephonique': 'Pré-rendez-vous téléphonique',
  implantologie: 'Implantologie',
  orthodontie: 'Orthodontie invisible',
}

const getAppointmentSpecialtyLabel = (specialty) => appointmentSpecialties[specialty] || specialty || 'Besoin non renseigné'

function StatusBadge({ status, compact = false }) {
  const option = appointmentStatuses[status] || appointmentStatuses.new
  return <span className={`inline-flex shrink-0 items-center rounded-full border font-black ${compact ? 'px-2 py-1 text-[.62rem]' : 'px-2.5 py-1 text-[.68rem]'} ${option.className}`}>{option.label}</span>
}

function AppointmentsAdmin({ onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try { setItems(await getAppointments()) }
    catch { setError('Impossible de charger les demandes de pré-rendez-vous.') }
    finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [])
  const filtered = useMemo(() => items.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter
    const haystack = `${item.name} ${item.phone} ${item.email} ${item.city} ${getAppointmentSpecialtyLabel(item.specialty)} ${item.callback_window} ${item.contact_preference}`.toLowerCase()
    return matchesStatus && haystack.includes(search.toLowerCase().trim())
  }), [items, filter, search])

  const changeStatus = async (id, status) => {
    setError('')
    try {
      await updateAppointmentStatus(id, status)
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      onChanged?.()
    } catch { setError('Le statut n’a pas pu être mis à jour.') }
  }

  const remove = async (id) => {
    if (!window.confirm('Supprimer définitivement cette demande ?')) return
    try {
      await deleteAppointment(id)
      setItems((current) => current.filter((item) => item.id !== id))
      onChanged?.()
    } catch { setError('La demande n’a pas pu être supprimée.') }
  }

  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <button type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'} className={`${panelClass} flex items-center justify-between p-4 text-left transition ${filter === 'all' ? 'border-[#856938] ring-4 ring-[#856938]/10' : 'hover:border-[#c8d5ce]'}`}><span><span className="block text-2xl font-black">{items.length}</span><span className="text-xs font-bold text-[#718079]">Toutes</span></span><span className="rounded-full bg-[#edf3f0] px-2.5 py-1 text-[.68rem] font-black text-[#214e3e]">Total</span></button>
      {Object.entries(appointmentStatuses).map(([key, option]) => <button key={key} type="button" onClick={() => setFilter(filter === key ? 'all' : key)} className={`${panelClass} flex items-center justify-between p-4 text-left transition ${filter === key ? 'border-[#856938] ring-4 ring-[#856938]/10' : 'hover:border-[#c8d5ce]'}`}><span><span className="block text-2xl font-black">{items.filter((item) => item.status === key).length}</span><span className="text-xs font-bold text-[#718079]">{option.label}</span></span><StatusBadge status={key} compact /></button>)}
    </div>
    <section className={`${panelClass} p-4 sm:p-6`}>
      <div className="flex flex-col gap-4 border-b border-[#e5ebe7] pb-5 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-lg font-bold">Toutes les demandes</h2><p className="mt-1 text-xs text-[#718079]">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative"><span className="sr-only">Rechercher une demande</span><Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#829088]" /><input type="search" className={`${inputClass} pl-10 sm:w-72`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, téléphone, ville, besoin…" /></label>
          <button type="button" className={secondaryButton} onClick={refresh}><Icon name="refresh" className="h-4 w-4" />Rafraîchir</button>
        </div>
      </div>
      {(filter !== 'all' || search) && <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#68766f]"><span>Filtres actifs :</span>{filter !== 'all' && <button type="button" className="rounded-full bg-[#edf3f0] px-3 py-1.5 font-bold text-[#214e3e]" onClick={() => setFilter('all')}>{appointmentStatuses[filter].label} ×</button>}{search && <button type="button" className="rounded-full bg-[#f5f0e5] px-3 py-1.5 font-bold text-[#856938]" onClick={() => setSearch('')}>« {search} » ×</button>}</div>}
      {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5" aria-live="polite">
        {loading ? <div className="flex items-center justify-center gap-3 py-16 text-sm text-[#718079]"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#cbd8d1] border-t-[#214e3e]" aria-hidden="true" />Chargement des demandes…</div> : filtered.length === 0 ? <EmptyState icon="appointments" title="Aucune demande trouvée" description={items.length ? 'Modifiez ou supprimez les filtres pour retrouver une demande.' : 'Les prochaines demandes envoyées depuis le site apparaîtront ici.'} /> : <div className="grid gap-4 2xl:grid-cols-2">{filtered.map((item) => <AppointmentCard key={item.id} item={item} onStatus={changeStatus} onDelete={remove} />)}</div>}
      </div>
    </section>
  </div>
}

function AppointmentCard({ item, onStatus, onDelete }) {
  return <article className="rounded-2xl border border-[#e0e7e3] bg-[#fdfefc] p-5 transition hover:border-[#cbd7d1]">
    <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf1ed] text-sm font-black text-[#214e3e]">{item.name?.charAt(0)?.toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{item.name}</h3><StatusBadge status={item.status} /></div><p className="mt-1 text-xs text-[#718079]">{getAppointmentSpecialtyLabel(item.specialty)} · {formatDate(item.created_at)}</p></div><button type="button" aria-label="Supprimer" className="rounded-lg p-2 text-[#9aa6a0] transition hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(item.id)}><Icon name="trash" className="h-4 w-4" /></button></div>
    <div className="mt-5 grid gap-2 sm:grid-cols-2"><a href={`tel:${item.phone}`} className="flex min-h-12 items-center gap-3 rounded-xl bg-[#214e3e] p-3 text-sm font-bold text-white transition hover:bg-[#173d30]" aria-label={`Appeler ${item.name} au ${item.phone}`}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Icon name="phone" className="h-4 w-4" /></span><span><span className="block text-[.65rem] uppercase tracking-wider text-white/60">Appeler</span>{item.phone}</span></a>{item.email ? <a href={`mailto:${item.email}`} className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-[#dfe7e2] bg-white p-3 text-sm font-bold text-[#214e3e] transition hover:border-[#b7c8c0]" aria-label={`Envoyer un e-mail à ${item.name}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf3f0]"><Icon name="mail" className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[.65rem] uppercase tracking-wider text-[#829088]">E-mail</span><span className="block truncate">{item.email}</span></span></a> : <div className="flex min-h-12 items-center gap-3 rounded-xl border border-dashed border-[#dfe7e2] bg-[#fafbf9] p-3 text-sm text-[#829088]"><Icon name="mail" className="h-4 w-4" />E-mail non renseigné</div>}</div>
    <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2"><div><dt className="font-bold uppercase tracking-wider text-[#89958f]">Ville</dt><dd className="mt-1 font-semibold">{item.city || 'Non renseignée'}</dd></div><div><dt className="font-bold uppercase tracking-wider text-[#89958f]">Rappel souhaité</dt><dd className="mt-1 font-semibold">{item.callback_window} · {item.contact_preference}</dd></div></dl>
    {item.note && <div className="mt-4 rounded-xl border border-[#e3e9e5] bg-white p-3 text-sm leading-6 text-[#53625b] whitespace-pre-wrap">{item.note}</div>}
    <div className="mt-5 flex items-center gap-3 border-t border-[#e5ebe7] pt-4"><label className="text-xs font-bold text-[#718079]" htmlFor={`status-${item.id}`}>Faire évoluer le suivi</label><select id={`status-${item.id}`} className="ml-auto rounded-xl border border-[#d8e1dc] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#856938]" value={item.status} onChange={(event) => onStatus(item.id, event.target.value)}>{Object.entries(appointmentStatuses).map(([value, option]) => <option key={value} value={value}>{option.label}</option>)}</select></div>
  </article>
}

function ServicesAdmin() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const refresh = async () => { try { setItems(await getServices()) } catch { setError('Impossible de charger les services.') } }
  useEffect(() => { refresh() }, [])

  const reset = () => { setEditing(null); setTitle(''); setDescription('') }
  const submit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true); setError('')
    try {
      if (editing) await updateService(editing.id, { title: title.trim(), description: description.trim() })
      else await createService({ title: title.trim(), description: description.trim() })
      reset(); await refresh()
    } catch { setError('Le service n’a pas pu être enregistré.') }
    finally { setSaving(false) }
  }

  return <div className="grid items-start gap-6 xl:grid-cols-[.72fr_1.28fr]">
    <form onSubmit={submit} className={`${panelClass} p-5 sm:p-7 xl:sticky xl:top-28`}><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf1ed] text-[#214e3e]"><Icon name={editing ? 'edit' : 'plus'} /></span><h2 className="mt-5 text-xl font-bold">{editing ? 'Modifier le service' : 'Ajouter un service'}</h2><p className="mt-1 text-sm text-[#718079]">Ces informations seront visibles sur le site public.</p><div className="mt-6 space-y-4"><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#63716a]">Titre *</span><input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Implantologie" required /></label><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#63716a]">Description</span><textarea className={`${inputClass} min-h-32 resize-y`} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Présentez brièvement le service…" /></label></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-5 flex gap-2"><button className={primaryButton} disabled={saving}>{saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Ajouter le service'}</button>{editing && <button type="button" className={secondaryButton} onClick={reset}>Annuler</button>}</div></form>
    <section className={`${panelClass} p-5 sm:p-7`}><SectionHeading title="Services publiés" description={`${items.length} service${items.length !== 1 ? 's' : ''} actuellement sur le site.`} />{items.length === 0 ? <div className="mt-6"><EmptyState icon="services" title="Aucun service" description="Ajoutez votre premier service avec le formulaire." /></div> : <div className="mt-6 space-y-3">{items.map((service) => <article key={service.id} className="flex flex-col gap-4 rounded-2xl border border-[#e2e8e4] p-4 sm:flex-row sm:items-center"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3f0] text-[#214e3e]"><Icon name="services" className="h-[1.1rem] w-[1.1rem]" /></span><div className="min-w-0 flex-1"><h3 className="font-bold">{service.title}</h3><p className="mt-1 text-sm leading-6 text-[#718079]">{service.description || 'Aucune description'}</p></div><div className="flex gap-2"><button type="button" className={secondaryButton} onClick={() => { setEditing(service); setTitle(service.title); setDescription(service.description || ''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="edit" className="h-4 w-4" />Modifier</button><button type="button" aria-label="Supprimer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50" onClick={async () => { if (window.confirm('Supprimer ce service ?')) { await deleteService(service.id); refresh() } }}><Icon name="trash" className="h-4 w-4" /></button></div></article>)}</div>}</section>
  </div>
}

function GalleryAdmin() {
  const [data, setData] = useState({ implant: [], invisalign: [], general: [] })
  const [section, setSection] = useState('implant')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const sections = [
    { key: 'implant', title: 'Implantologie' },
    { key: 'invisalign', title: 'Orthodontie invisible' },
    { key: 'general', title: 'Soins généraux' },
  ]
  const refresh = async () => { try { setData(await getGallery()) } catch { setError('Impossible de charger la galerie.') } }
  useEffect(() => { refresh() }, [])

  const add = async (event) => {
    event.preventDefault()
    if (!file && !url.trim()) return
    setSaving(true); setError('')
    try {
      await addGalleryItem(section, file || url.trim())
      setUrl(''); setFile(null); if (fileRef.current) fileRef.current.value = ''; await refresh()
    } catch (uploadError) { setError(uploadError.message || 'L’image n’a pas pu être ajoutée.') }
    finally { setSaving(false) }
  }

  const current = data[section] || []
  return <div className="space-y-6">
    <form onSubmit={add} className={`${panelClass} p-5 sm:p-7`}><SectionHeading title="Ajouter une image" description="Formats JPG, PNG, WebP, GIF ou AVIF · 5 Mo maximum." /><div className="mt-6 grid gap-4 lg:grid-cols-[.75fr_1fr_1fr_auto] lg:items-end"><label><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#63716a]">Catégorie</span><select className={inputClass} value={section} onChange={(event) => setSection(event.target.value)}>{sections.map((item) => <option key={item.key} value={item.key}>{item.title}</option>)}</select></label><label><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#63716a]">Fichier</span><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#eaf1ed] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#214e3e]`} onChange={(event) => setFile(event.target.files?.[0] || null)} /></label><label><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#63716a]">Ou URL HTTPS</span><input className={inputClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" /></label><button className={primaryButton} disabled={saving || (!file && !url.trim())}><Icon name="upload" className="h-4 w-4" />{saving ? 'Ajout…' : 'Ajouter'}</button></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</form>
    <section className={`${panelClass} p-5 sm:p-7`}><div className="flex flex-col gap-4 border-b border-[#e5ebe7] pb-5 md:flex-row md:items-end md:justify-between"><SectionHeading title="Bibliothèque" description={`${Object.values(data).flat().length} image${Object.values(data).flat().length !== 1 ? 's' : ''} au total.`} /><div className="flex flex-wrap gap-2">{sections.map((item) => <button key={item.key} type="button" onClick={() => setSection(item.key)} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${section === item.key ? 'bg-[#214e3e] text-white' : 'bg-[#f1f4f2] text-[#5f6e67] hover:bg-[#e7ede9]'}`}>{item.title} <span className="ml-1 opacity-60">{data[item.key]?.length || 0}</span></button>)}</div></div>{current.length === 0 ? <div className="mt-6"><EmptyState icon="gallery" title="Catégorie vide" description="Ajoutez une première image à cette catégorie." /></div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{current.map((image) => <figure key={image.id} className="group overflow-hidden rounded-2xl border border-[#e0e7e3] bg-[#fafbf9]"><div className="relative aspect-[4/3] overflow-hidden bg-[#edf1ee]"><img src={image.url} alt={sections.find((item) => item.key === section)?.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><button type="button" aria-label="Supprimer l’image" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-red-500 opacity-0 shadow-lg backdrop-blur transition hover:bg-red-50 group-hover:opacity-100" onClick={async () => { if (window.confirm('Supprimer cette image ?')) { await deleteGalleryItem(section, image.id); refresh() } }}><Icon name="trash" className="h-4 w-4" /></button></div><figcaption className="p-3 text-xs font-bold text-[#718079]">{sections.find((item) => item.key === section)?.title}</figcaption></figure>)}</div>}</section>
  </div>
}

function MessagesAdmin({ onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const refresh = async () => { setLoading(true); setError(''); try { setItems(await getMessages()) } catch { setError('Impossible de charger les messages.') } finally { setLoading(false) } }
  useEffect(() => { refresh() }, [])
  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.email} ${item.phone} ${item.message}`.toLowerCase().includes(search.toLowerCase().trim())), [items, search])
  const remove = async (id) => { if (!window.confirm('Supprimer définitivement ce message ?')) return; try { await deleteMessage(id); setItems((current) => current.filter((item) => item.id !== id)); onChanged?.() } catch { setError('Le message n’a pas pu être supprimé.') } }

  return <section className={`${panelClass} p-4 sm:p-6`}><div className="flex flex-col gap-4 border-b border-[#e5ebe7] pb-5 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-bold">Boîte de réception</h2><p className="mt-1 text-xs text-[#718079]">{filtered.length} message{filtered.length !== 1 ? 's' : ''}</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#829088]" /><input className={`${inputClass} pl-10 sm:w-64`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher…" /></label><button type="button" className={secondaryButton} onClick={refresh}><Icon name="refresh" className="h-4 w-4" />Rafraîchir</button></div></div>{error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-5">{loading ? <p className="py-16 text-center text-sm text-[#718079]">Chargement des messages…</p> : filtered.length === 0 ? <EmptyState icon="messages" title="Aucun message" description="Les messages du formulaire de contact apparaîtront ici." /> : <div className="grid gap-4 xl:grid-cols-2">{filtered.map((message) => <article key={message.id} className="rounded-2xl border border-[#e0e7e3] bg-[#fdfefc] p-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3ede1] text-sm font-black text-[#856938]">{message.name?.charAt(0)?.toUpperCase()}</span><div className="min-w-0 flex-1"><h3 className="font-bold">{message.name}</h3><p className="mt-0.5 text-xs text-[#718079]">{formatDate(message.created_at || message.createdAt)}</p></div><button type="button" aria-label="Supprimer" className="rounded-lg p-2 text-[#9aa6a0] hover:bg-red-50 hover:text-red-600" onClick={() => remove(message.id)}><Icon name="trash" className="h-4 w-4" /></button></div><div className="mt-4 flex flex-wrap gap-2"><a href={`mailto:${message.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1f4f2] px-2.5 py-1.5 text-xs font-bold text-[#214e3e]"><Icon name="mail" className="h-3.5 w-3.5" />{message.email}</a>{message.phone && <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1f4f2] px-2.5 py-1.5 text-xs font-bold text-[#214e3e]"><Icon name="phone" className="h-3.5 w-3.5" />{message.phone}</a>}</div><p className="mt-4 rounded-xl border border-[#e6ebe8] bg-white p-4 text-sm leading-6 text-[#53625b] whitespace-pre-line">{message.message}</p></article>)}</div>}</div></section>
}

function formatDate(value) {
  if (!value) return 'Date inconnue'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
