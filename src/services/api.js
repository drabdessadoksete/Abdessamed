const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function authHeaders() {
  const t = localStorage.getItem('admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function getServices() {
  const r = await fetch(`${API_BASE}/api/services`)
  return r.json()
}

export async function createService(payload) {
  const r = await fetch(`${API_BASE}/api/services`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function updateService(id, payload) {
  const r = await fetch(`${API_BASE}/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function deleteService(id) {
  const r = await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}

export async function getGallery() {
  const r = await fetch(`${API_BASE}/api/gallery`)
  return r.json()
}

export async function addGalleryItem(section, fileOrUrl) {
  const isFile = fileOrUrl instanceof File
  if (isFile) {
    const fd = new FormData()
    fd.append('file', fileOrUrl)
    const r = await fetch(`${API_BASE}/api/gallery/${section}`, { method: 'POST', headers: { ...authHeaders() }, body: fd })
    return r.json()
  }
  const r = await fetch(`${API_BASE}/api/gallery/${section}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ url: fileOrUrl }) })
  return r.json()
}

export async function deleteGalleryItem(section, id) {
  const r = await fetch(`${API_BASE}/api/gallery/${section}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}

export async function getMessages() {
  const r = await fetch(`${API_BASE}/api/messages`)
  return r.json()
}

export async function submitMessage(payload) {
  const r = await fetch(`${API_BASE}/api/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return r.json()
}

export async function loginAdmin(password) {
  const r = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
  const data = await r.json()
  if (data.token) localStorage.setItem('admin_token', data.token)
  return data
}

export async function uploadMedia(file) {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${API_BASE}/api/media/upload`, { method: 'POST', headers: { ...authHeaders() }, body: fd })
  return r.json()
}

export async function listMedia() {
  const r = await fetch(`${API_BASE}/api/media`, { headers: { ...authHeaders() } })
  return r.json()
}

export async function getArticles(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  const r = await fetch(`${API_BASE}/api/articles${qs}`)
  return r.json()
}

export async function getArticle(id) {
  const r = await fetch(`${API_BASE}/api/articles/${id}`)
  return r.json()
}

export async function createArticle(payload) {
  const r = await fetch(`${API_BASE}/api/articles`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function updateArticle(id, payload) {
  const r = await fetch(`${API_BASE}/api/articles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function deleteArticle(id) {
  const r = await fetch(`${API_BASE}/api/articles/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}