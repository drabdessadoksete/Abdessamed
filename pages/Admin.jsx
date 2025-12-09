import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import logo from '../assets/new logo.png'
import { getServices, createService, updateService, deleteService, getGallery, addGalleryItem, deleteGalleryItem, getMessages, loginAdmin } from '../services/api'
import { getUser, signOut } from '../services/supabase'

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@local')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onLogin(email, password)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="card p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-12 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            className="w-full rounded-xl bg-surface border border-slate-700 px-4 py-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-xl bg-surface border border-slate-700 px-4 py-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function Admin(){
  const [tab, setTab] = useState('services')
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
              <button type="button" className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-surface hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-rolexGold" onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground"><path d="M6 12h12v2H6z"/></svg>
              </button>
            </div>
            <div className="p-4 md:p-6">
              <nav className="space-y-2">
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
        {tab === 'services' && <ServicesAdmin />}
        {tab === 'gallery' && <GalleryAdmin />}
        {tab === 'messages' && <MessagesAdmin />}
      </div>
    </div>
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
              <th className="p-2">Téléphone</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-t border-slate-700">
                <td className="p-2 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                <td className="p-2 whitespace-nowrap">{m.name}</td>
                <td className="p-2 whitespace-nowrap">{m.email}</td>
                <td className="p-2 whitespace-nowrap">{m.phone}</td>
                <td className="p-2">{m.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
