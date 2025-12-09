import * as supabaseApi from './supabase.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true'

function authHeaders() {
  const t = localStorage.getItem('admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function getServices() {
  if (useSupabase) return supabaseApi.getServices()
  const r = await fetch(`${API_BASE}/api/services`)
  return r.json()
}

export async function createService(payload) {
  if (useSupabase) return supabaseApi.createService(payload)
  const r = await fetch(`${API_BASE}/api/services`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function updateService(id, payload) {
  if (useSupabase) return supabaseApi.updateService(id, payload)
  const r = await fetch(`${API_BASE}/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function deleteService(id) {
  if (useSupabase) return supabaseApi.deleteService(id)
  const r = await fetch(`${API_BASE}/api/services/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}

export async function getGallery() {
  if (useSupabase) return supabaseApi.getGallery()
  const r = await fetch(`${API_BASE}/api/gallery`)
  return r.json()
}

export async function addGalleryItem(section, fileOrUrl) {
  if (useSupabase) return supabaseApi.uploadGalleryImage(section, fileOrUrl)
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
  if (useSupabase) return supabaseApi.deleteGalleryImage(section, id)
  const r = await fetch(`${API_BASE}/api/gallery/${section}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}

export async function getMessages() {
  if (useSupabase) return supabaseApi.getMessages()
  const r = await fetch(`${API_BASE}/api/messages`)
  return r.json()
}

export async function submitMessage(payload) {
  if (useSupabase) return supabaseApi.createMessage(payload)
  const r = await fetch(`${API_BASE}/api/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return r.json()
}

export async function loginAdmin(email, password) {
  if (useSupabase) {
    try {
      const data = await supabaseApi.signIn(email, password)
      localStorage.setItem('admin_token', data.session.access_token)
      return { token: data.session.access_token }
    } catch (error) {
      return { error: error.message }
    }
  }
  const r = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
  const data = await r.json()
  if (data.token) localStorage.setItem('admin_token', data.token)
  return data
}

export async function uploadMedia(file) {
  if (useSupabase) return supabaseApi.uploadMedia(file)
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${API_BASE}/api/media/upload`, { method: 'POST', headers: { ...authHeaders() }, body: fd })
  return r.json()
}

export async function listMedia() {
  if (useSupabase) return supabaseApi.getMedia()
  const r = await fetch(`${API_BASE}/api/media`, { headers: { ...authHeaders() } })
  return r.json()
}

export async function getArticles(status) {
  if (useSupabase) return supabaseApi.getArticles(status)
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  const r = await fetch(`${API_BASE}/api/articles${qs}`)
  return r.json()
}

export async function getArticle(id) {
  if (useSupabase) return supabaseApi.getArticle(id)
  const r = await fetch(`${API_BASE}/api/articles/${id}`)
  return r.json()
}

export async function createArticle(payload) {
  if (useSupabase) return supabaseApi.createArticle(payload)
  const r = await fetch(`${API_BASE}/api/articles`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function updateArticle(id, payload) {
  if (useSupabase) return supabaseApi.updateArticle(id, payload)
  const r = await fetch(`${API_BASE}/api/articles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) })
  return r.json()
}

export async function deleteArticle(id) {
  if (useSupabase) return supabaseApi.deleteArticle(id)
  const r = await fetch(`${API_BASE}/api/articles/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return r.json()
}