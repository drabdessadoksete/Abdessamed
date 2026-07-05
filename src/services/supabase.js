import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

const requireSupabase = () => {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

const allowedImages = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
])

const storageFileName = (file) => {
  const extension = allowedImages.get(file?.type)
  if (!extension) throw new Error('Format non autorisé. Utilisez JPG, PNG, WebP, GIF ou AVIF.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse la limite de 5 Mo.')
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${id}.${extension}`
}

const extractStoragePath = (url, bucket) => {
  if (!url) return null
  const marker = `/${bucket}/`
  try {
    const u = new URL(url)
    if (u.pathname.includes(marker)) return decodeURIComponent(u.pathname.split(marker)[1])
    return null
  } catch {
    if (url.includes(marker)) return decodeURIComponent(url.split(marker)[1])
    return null
  }
}

// Services
export const getServices = async () => {
  const { data, error } = await requireSupabase().from('services').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createService = async (service) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('services').insert(service).select().single()
  if (error) throw error
  return data
}

export const updateService = async (id, updates) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteService = async (id) => {
  if (!supabase) return null
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
  return true
}

// Gallery
export const getGallery = async () => {
  if (!supabase) return { implant: [], invisalign: [], general: [] }
  const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
  if (error) throw error
  const gallery = { implant: [], invisalign: [], general: [] }
  data.forEach(item => {
    if (gallery[item.category]) gallery[item.category].push(item)
  })
  return gallery
}

export const uploadGalleryImage = async (category, file) => {
  if (typeof file === 'string') {
    const url = new URL(file)
    if (url.protocol !== 'https:') throw new Error('L\'image doit utiliser une URL HTTPS.')
    const { data, error } = await requireSupabase().from('gallery_images').insert({ url: url.toString(), category, thumb_url: url.toString() }).select().single()
    if (error) throw error
    return data
  }
  const fileName = storageFileName(file)
  const { data: uploadData, error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
  const item = { url: publicUrl, category, thumb_url: publicUrl } // For now, same URL
  const { data, error } = await supabase.from('gallery_images').insert(item).select().single()
  if (error) throw error
  return data
}

export const deleteGalleryImage = async (category, id) => {
  if (!supabase) return null
  const { data: item } = await supabase.from('gallery_images').select('url').eq('id', id).maybeSingle()
  const path = extractStoragePath(item?.url, 'gallery')
  if (path) await supabase.storage.from('gallery').remove([path])
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)
  if (error) throw error
  return true
}

// Messages
export const getMessages = async () => {
  if (!supabase) return []
  const { data, error } = await supabase.from('messages').select('id, name, email, phone, message, created_at').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createMessage = async (message) => {
  const { error } = await requireSupabase().from('messages').insert(message)
  if (error) throw error
  return { success: true }
}

// Pre-appointments
export const getAppointments = async () => {
  const { data, error } = await requireSupabase()
    .from('appointments')
    .select('id, name, phone, email, city, specialty, contact_preference, callback_window, note, status, consent_at, created_at, updated_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createAppointment = async (appointment) => {
  const { error } = await requireSupabase().from('appointments').insert(appointment)
  if (error) throw error
  return { success: true }
}

export const updateAppointment = async (id, updates) => {
  const { data, error } = await requireSupabase().from('appointments').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteAppointment = async (id) => {
  const { error } = await requireSupabase().from('appointments').delete().eq('id', id)
  if (error) throw error
  return true
}

export const deleteMessage = async (id) => {
  if (!supabase) return null
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
  return true
}

// Articles
export const getArticles = async (status = null) => {
  if (!supabase) return []
  let query = supabase.from('articles').select('id, title, status, content_html, created_at, updated_at').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data
}

export const getArticle = async (id) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('articles').select('id, title, status, content_html, created_at, updated_at').eq('id', id).single()
  if (error) throw error
  return data
}

export const createArticle = async (article) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('articles').insert(article).select().single()
  if (error) throw error
  return data
}

export const updateArticle = async (id, updates) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteArticle = async (id) => {
  if (!supabase) return null
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
  return true
}

// Media
export const getMedia = async () => {
  if (!supabase) return []
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const uploadMedia = async (file) => {
  if (!supabase) return null
  const fileName = storageFileName(file)
  const { data: uploadData, error: uploadError } = await supabase.storage.from('media').upload(fileName, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
  const item = { url: publicUrl, thumb_url: publicUrl, meta: {} } // Simplified
  const { data, error } = await supabase.from('media').insert(item).select().single()
  if (error) throw error
  return data
}

export const deleteMedia = async (id, url) => {
  if (!supabase) return null
  const path = extractStoragePath(url, 'media')
  if (path) {
    try {
      await supabase.storage.from('media').remove([path])
    } catch {
      // ignore storage cleanup errors so DB entry still gets removed
    }
  }
  const { error } = await supabase.from('media').delete().eq('id', id)
  if (error) throw error
  return true
}

// Auth
export const signIn = async (email, password) => {
  if (!supabase) return null
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  if (!supabase) return null
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

export const getUser = async () => {
  if (!supabase) return null
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

export const getAdminUser = async () => {
  const user = await getUser()
  if (!user) return null
  const { data: isAdmin, error } = await supabase.rpc('is_admin')
  if (error || !isAdmin) return null
  return user
}

export const onAuthStateChange = (callback) => {
  if (!supabase) return { unsubscribe: () => {} }
  const { data } = supabase.auth.onAuthStateChange(callback)
  return data.subscription
}
