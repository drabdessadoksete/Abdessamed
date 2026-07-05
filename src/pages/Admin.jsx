import { useState, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import logo from '../assets/Favicon/android-chrome-192x192.png'
import { getServices, createService, updateService, deleteService, getGallery, addGalleryItem, deleteGalleryItem, getMessages, deleteMessage, getAppointments, updateAppointmentStatus, deleteAppointment, logoutAdmin } from '../services/api'

const handleLogout = async () => {
  await logoutAdmin()
  window.location.href = "/login"
};

export default function Admin(){
  const [tab, setTab] = useState('appointments')
  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {!open && (
        <div
          className="fixed left-0 top-0 h-full w-[16px] md:w-[16px] border-r border-slate-800 bg-rolexGreen/60 glass-green z-20 group cursor-pointer transition-all hover:w-[48px]"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-start justify-center pt-3">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full object-cover opacity-90 group-hover:opacity-100" />
          </div>
        </div>
      )}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 h-full w-[260px] md:w-[240px] border-r border-slate-800 bg-rolexGreen/60 glass-green z-10"
          >
            <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
                <div className="font-semibold">Admin</div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-surface hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-rolexGold" onClick={() => setOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground"><path d="M6 12h12v2H6z"/></svg>
                </button>
                <button type="button" className="inline-flex items-center justify-center h-9 px-3 rounded-xl border border-slate-800 bg-surface hover:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-rolexGold" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <nav className="space-y-2">
                <button type="button" onClick={() => setTab('appointments')} className={`w-full text-left px-3 py-2 rounded-xl transition ${tab==='appointments' ? 'text-rolexGold border border-rolexGold/40 bg-rolexGold/10 backdrop-blur-sm' : 'hover:bg-rolexGold/10'}`}>Pré-rendez-vous</button>
                <button type="button" onClick={() => setTab('services')} className={`w-full text-left px-3 py-2 rounded-xl transition ${tab==='services' ? 'text-rolexGold border border-rolexGold/40 bg-rolexGold/10 backdrop-blur-sm' : 'hover:bg-rolexGold/10'}`}>Services</button>
                <button type="button" onClick={() => setTab('gallery')} className={`w-full text-left px-3 py-2 rounded-xl transition ${tab==='gallery' ? 'text-rolexGold border border-rolexGold/40 bg-rolexGold/10 backdrop-blur-sm' : 'hover:bg-rolexGold/10'}`}>Galerie</button>
                <button type="button" onClick={() => setTab('messages')} className={`w-full text-left px-3 py-2 rounded-xl transition ${tab==='messages' ? 'text-rolexGold border border-rolexGold/40 bg-rolexGold/10 backdrop-blur-sm' : 'hover:bg-rolexGold/10'}`}>Messages</button>
                <Link to="/admin/actualities" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Actualités</Link>
              </nav>
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">Navigation du site</div>
                <div className="space-y-2">
                  <Link to="/" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Accueil</Link>
                  <Link to="/about" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">À propos</Link>
                  <Link to="/services" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Services</Link>
                  <Link to="/actualities" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Actualités</Link>
                  <Link to="/gallery" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Galerie</Link>
                  <Link to="/contact" className="block px-3 py-2 rounded-xl transition hover:bg-rolexGold/10">Contact</Link>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 bg-black/40 md:hidden z-0" onClick={() => setOpen(false)} />}
      <div className={`${open ? 'md:ml-[240px]' : ''} p-4 md:p-6 relative z-0`}> 
        {tab === 'appointments' && <AppointmentsAdmin />}
        {tab === 'services' && <ServicesAdmin />}
        {tab === 'gallery' && <GalleryAdmin />}
        {tab === 'messages' && <MessagesAdmin />}
      </div>
    </div>
  )
}

const appointmentStatuses = {
  new: { label: 'Nouveau', className: 'border-amber-300/40 bg-amber-300/10 text-amber-200' },
  contacted: { label: 'Contacté', className: 'border-sky-300/40 bg-sky-300/10 text-sky-200' },
  scheduled: { label: 'Rendez-vous fixé', className: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200' },
  closed: { label: 'Clôturé', className: 'border-slate-400/40 bg-slate-400/10 text-slate-300' },
}

function AppointmentsAdmin(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try { setItems(await getAppointments()) }
    catch { setError('Impossible de charger les demandes de pré-rendez-vous.') }
    finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [])

  const changeStatus = async (id, status) => {
    setError('')
    try {
      await updateAppointmentStatus(id, status)
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item))
    } catch { setError('Le statut n\'a pas pu être mis à jour.') }
  }

  const remove = async (id) => {
    if (!window.confirm('Supprimer définitivement cette demande ?')) return
    try {
      await deleteAppointment(id)
      setItems((current) => current.filter((item) => item.id !== id))
    } catch { setError('La demande n\'a pas pu être supprimée.') }
  }

  return (
    <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Demandes de pré-rendez-vous</h1>
          <p className="mt-1 text-sm text-muted">{items.length} demande{items.length > 1 ? 's' : ''}</p>
        </div>
        <button type="button" className="btn-outline" onClick={refresh}>Rafraîchir</button>
      </div>
      {error && <p className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {loading ? <p className="text-muted">Chargement…</p> : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-muted">Aucune demande pour le moment.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => {
            const status = appointmentStatuses[item.status] || appointmentStatuses.new
            return (
              <article key={item.id} className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                    <h2 className="mt-3 text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-muted">{item.specialty === 'implantologie' ? 'Implantologie' : 'Orthodontie invisible'} • {new Date(item.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                  <button type="button" className="text-sm text-red-300 hover:text-red-200" onClick={() => remove(item.id)}>Supprimer</button>
                </div>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-muted">Téléphone</dt><dd><a className="font-semibold text-rolexGold" href={`tel:${item.phone}`}>{item.phone}</a></dd></div>
                  <div><dt className="text-muted">E-mail</dt><dd>{item.email ? <a className="font-semibold text-rolexGold" href={`mailto:${item.email}`}>{item.email}</a> : '—'}</dd></div>
                  <div><dt className="text-muted">Ville</dt><dd>{item.city || '—'}</dd></div>
                  <div><dt className="text-muted">Rappel souhaité</dt><dd>{item.callback_window} • {item.contact_preference}</dd></div>
                </dl>
                {item.note && <div className="mt-4 rounded-xl bg-slate-900/40 p-3 text-sm whitespace-pre-wrap">{item.note}</div>}
                <label className="mt-5 block text-sm font-semibold">Suivi
                  <select className="form-control mt-2" value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}>
                    {Object.entries(appointmentStatuses).map(([value, option]) => <option key={value} value={value}>{option.label}</option>)}
                  </select>
                </label>
              </article>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function ServicesAdmin(){
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)
  useEffect(() => { refresh() }, [])
  const refresh = async () => { try { const s = await getServices(); setItems(s) } catch {} }
  const submit = async () => {
    if (!title) return
    if (editing) {
      await updateService(editing.id, { title, description })
      setEditing(null)
    } else {
      await createService({ title, description })
    }
    setTitle(''); setDescription(''); refresh()
  }
  const remove = async (id) => { await deleteService(id); refresh() }
  return (
    <div className="space-y-6">
      <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-xl font-semibold mb-3">Ajouter / Modifier un service</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="rounded-xl bg-surface border border-slate-700 px-4 py-3" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="rounded-xl bg-surface border border-slate-700 px-4 py-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-primary" onClick={submit}>{editing ? 'Mettre à jour' : 'Ajouter'}</button>
          {editing && <button type="button" className="btn-outline" onClick={() => { setEditing(null); setTitle(''); setDescription('') }}>Annuler</button>}
        </div>
      </motion.div>
      <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-xl font-semibold mb-3">Liste des services</h2>
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-muted">{s.description}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-outline" onClick={() => { setEditing(s); setTitle(s.title); setDescription(s.description) }}>Modifier</button>
                <button type="button" className="btn-outline" onClick={() => remove(s.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function GalleryAdmin(){
  const [data, setData] = useState({ implant: [], invisalign: [], general: [] })
  const [section, setSection] = useState('implant')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  useEffect(() => { refresh() }, [])
  const refresh = async () => { try { const g = await getGallery(); setData(g) } catch {} }
  const add = async () => {
    if (file) await addGalleryItem(section, file)
    else if (url) await addGalleryItem(section, url)
    setUrl(''); setFile(null); refresh()
  }
  const remove = async (sec, id) => { await deleteGalleryItem(sec, id); refresh() }
  const sections = [
    { key: 'implant', title: 'Implantologie & Chirurgie Orale' },
    { key: 'invisalign', title: "Invisalign® - L'Orthodontie Invisible" },
    { key: 'general', title: 'Soins généraux' },
  ]
  return (
    <div className="space-y-6">
      <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-xl font-semibold mb-3">Ajouter une image</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <select className="rounded-xl bg-surface border border-slate-700 px-4 py-3" value={section} onChange={(e) => setSection(e.target.value)}>
            {sections.map((s) => (<option key={s.key} value={s.key}>{s.title}</option>))}
          </select>
          <input className="rounded-xl bg-surface border border-slate-700 px-4 py-3" placeholder="URL (facultatif)" value={url} onChange={(e) => setUrl(e.target.value)} />
          <input type="file" accept="image/*" className="rounded-xl bg-surface border border-slate-700 px-4 py-2" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <div className="mt-3">
          <button type="button" className="btn-primary" onClick={add}>Ajouter</button>
        </div>
      </motion.div>
      {sections.map((s) => (
        <motion.div key={s.key} className="card p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(data[s.key] || []).map((i) => (
              <div key={i.id} className="rounded-xl overflow-hidden border border-slate-700">
                <img src={i.url} alt={s.title} className="w-full h-40 object-cover" />
                <div className="p-3 flex justify-end">
                  <button type="button" className="btn-outline" onClick={() => remove(s.key, i.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MessagesAdmin(){
  const [items, setItems] = useState([])
  useEffect(() => { refresh() }, [])
  const refresh = async () => { try { const m = await getMessages(); setItems(m) } catch {} }
  const remove = async (id) => { await deleteMessage(id); refresh() }
  return (
    <motion.div className="card p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2 className="text-xl font-semibold mb-3">Messages</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Telephone</th>
              <th className="p-2">Message</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-t border-slate-700">
                <td className="p-2 whitespace-nowrap">{new Date(m.created_at || m.createdAt).toLocaleString()}</td>
                <td className="p-2 whitespace-nowrap">{m.name}</td>
                <td className="p-2 whitespace-nowrap">{m.email}</td>
                <td className="p-2 whitespace-nowrap">{m.phone}</td>
                <td className="p-2">
                  {m.message?.startsWith('[PRÉ-RDV') ? <span className="mb-2 inline-flex rounded-full border border-rolexGold/30 bg-rolexGold/10 px-2 py-0.5 text-xs font-bold text-rolexGold">Pré-rendez-vous</span> : null}
                  <span className="block whitespace-pre-line">{m.message}</span>
                </td>
                <td className="p-2 text-right">
                  <button type="button" className="btn-outline" onClick={() => remove(m.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
