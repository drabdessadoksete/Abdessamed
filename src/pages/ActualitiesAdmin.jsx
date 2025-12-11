import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { loginAdmin, listMedia, uploadMedia, deleteMedia, createArticle, updateArticle, deleteArticle, getArticles } from '../services/api'

function Toolbar({ exec, insertHeading, insertList }){
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button type="button" className="btn-outline" onClick={() => exec('bold')}>Gras</button>
      <button type="button" className="btn-outline" onClick={() => exec('italic')}>Italique</button>
      <button type="button" className="btn-outline" onClick={() => insertHeading('h2')}>Titre H2</button>
      <button type="button" className="btn-outline" onClick={() => insertHeading('h3')}>Titre H3</button>
      <button type="button" className="btn-outline" onClick={() => insertList('ul')}>Liste</button>
      <button type="button" className="btn-outline" onClick={() => insertList('ol')}>Liste numérotée</button>
    </div>
  )
}

function MediaPicker({ onPick }){
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const refresh = async () => { try { const m = await listMedia(); setItems(m) } catch {} }
  useEffect(() => { refresh() }, [])
  const upload = async () => { if (file) { await uploadMedia(file); setFile(null); refresh() } }
  const remove = async (item) => { await deleteMedia(item.id, item.url || item.file_url); refresh() }
  return (
    <div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-4">
      <div className="flex items-center gap-2 mb-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="button" className="btn-primary" onClick={upload}>Uploader</button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/40">
            <img src={i.thumbUrl || i.thumb_url || i.url} alt="media" className="w-full h-32 object-cover" />
            <div className="p-3 flex items-center justify-between gap-2">
              <button type="button" className="btn-outline" onClick={() => onPick(i)}>Inserer</button>
              <button type="button" className="btn-outline text-red-300 border-red-500 hover:bg-red-500/10" onClick={() => remove(i)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function YouTubeEmbed({ onInsert }){
  const [url, setUrl] = useState('')
  const parseId = (u) => {
    try {
      const m = u.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
      return m ? m[1] : null
    } catch { return null }
  }
  const insert = () => {
    const id = parseId(url)
    if (!id) return
    const html = `<div class="aspect-video rounded-xl overflow-hidden"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${id}" title="YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    onInsert(html)
    setUrl('')
  }
  return (
    <div className="flex items-center gap-2">
      <input className="rounded-xl bg-surface border border-slate-700 px-3 py-2 w-full" placeholder="Lien YouTube" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button type="button" className="btn-outline" onClick={insert}>Inserer</button>
    </div>
  )
}

export default function ActualitiesAdmin(){
  const [authed, setAuthed] = useState(true)
  const [password, setPassword] = useState('')
  const [articles, setArticles] = useState([])
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [contentHTML, setContentHTML] = useState('')
  const editorRef = useRef(null)
  const [status, setStatus] = useState('draft')
  const [preview, setPreview] = useState(false)

  const refresh = async () => { const list = await getArticles(); setArticles(list) }
  useEffect(() => { if (authed) refresh() }, [authed])

  const exec = (cmd) => document.execCommand(cmd, false)
  const insertHeading = (h) => document.execCommand('formatBlock', false, h)
  const insertList = (t) => document.execCommand(t === 'ul' ? 'insertUnorderedList' : 'insertOrderedList')
  const insertHTML = (html) => {
    editorRef.current?.focus()
    document.execCommand('insertHTML', false, html)
  }
  const onDrop = async (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith('image/')) {
      const m = await uploadMedia(f)
      insertHTML(`<figure class="my-3"><img src="${m.url}" class="rounded-xl w-full h-auto" loading="lazy" /></figure>`)
    }
  }

  const startEdit = (a) => { setEditing(a); setTitle(a.title); setStatus(a.status); setContentHTML(a.content_html); setPreview(false); setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = a.content_html }, 0) }
  const resetEdit = () => { setEditing(null); setTitle(''); setContentHTML(''); setStatus('draft'); if (editorRef.current) editorRef.current.innerHTML = '' }
  const save = async () => {
    const html = editorRef.current?.innerHTML || ''
    setContentHTML(html)
    if (editing) await updateArticle(editing.id, { title, content_html: html, status })
    else await createArticle({ title, content_html: html, status })
    resetEdit(); refresh()
  }
  const publish = async () => {
    const html = editorRef.current?.innerHTML || ''
    setContentHTML(html)
    setStatus('published')
    if (editing) await updateArticle(editing.id, { title, content_html: html, status: 'published' })
    else await createArticle({ title, content_html: html, status: 'published' })
    resetEdit(); refresh()
  }
  const remove = async (id) => { await deleteArticle(id); if (editing?.id === id) resetEdit(); refresh() }

  if (!authed) {
    return (
      <section className="section">
        <div className="container-max">
          <div className="card p-6 max-w-md mx-auto">
            <div className="text-xl font-semibold mb-3">Connexion Admin</div>
            <input type="password" className="w-full rounded-xl bg-surface border border-slate-700 px-4 py-3 mb-3" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="btn-primary w-full" onClick={async () => { const r = await loginAdmin(password); if (r.token) setAuthed(true) }}>Se connecter</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container-max">
        <div className="mb-4">
          <Link to="/admin" className="btn-outline">Retour au panneau admin</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-3">
            <input className="rounded-xl bg-surface border border-slate-700 px-3 py-2 w-full" placeholder="Titre de l’article" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select className="rounded-xl bg-surface border border-slate-700 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <Toolbar exec={exec} insertHeading={insertHeading} insertList={insertList} />
          <div
            ref={editorRef}
            className="rounded-xl border border-slate-700 bg-slate-800/50 min-h-[240px] p-4"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setContentHTML(e.target.innerHTML)}
            onDrop={onDrop}
          />
          <div className="mt-3 flex items-center gap-2">
            <button type="button" className="btn-primary" onClick={save}>{editing ? 'Mettre à jour' : 'Enregistrer'}</button>
            <button type="button" className="btn-outline" onClick={publish}>Publier l'article</button>
            <button type="button" className="btn-outline" onClick={() => setPreview((v) => !v)}>{preview ? 'Masquer aperçu' : 'Voir aperçu'}</button>
            {editing && <button type="button" className="btn-outline" onClick={resetEdit}>Annuler</button>}
          </div>
          <div className="mt-4 space-y-4">
            <MediaPicker onPick={(m) => insertHTML(`<figure class=\"my-3\"><img src=\"${m.url}\" class=\"rounded-xl w-full h-auto\" loading=\"lazy\" /></figure>`)} />
            <YouTubeEmbed onInsert={insertHTML} />
          </div>
          {preview && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/40 p-4" dangerouslySetInnerHTML={{ __html: contentHTML }} />
          )}
        </motion.div>

        <motion.div className="rounded-2xl border border-slate-800 bg-surface/60 backdrop-blur p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Articles</div>
            <button type="button" className="btn-outline" onClick={refresh}>Rafraîchir</button>
          </div>
          <div className="space-y-3">
            {articles.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-xs text-muted">{a.status} • {new Date(a.updated_at).toLocaleString()}</div>
                    </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-outline" onClick={() => startEdit(a)}>Modifier</button>
                    <button type="button" className="btn-outline" onClick={() => remove(a.id)}>Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
