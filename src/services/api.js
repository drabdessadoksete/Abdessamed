import * as supabaseApi from './supabase.js'

export async function getServices() {
  return supabaseApi.getServices()
}

export async function createService(payload) {
  return supabaseApi.createService(payload)
}

export async function updateService(id, payload) {
  return supabaseApi.updateService(id, payload)
}

export async function deleteService(id) {
  return supabaseApi.deleteService(id)
}

export async function getGallery() {
  return supabaseApi.getGallery()
}

export async function addGalleryItem(section, fileOrUrl) {
  return supabaseApi.uploadGalleryImage(section, fileOrUrl)
}

export async function deleteGalleryItem(section, id) {
  return supabaseApi.deleteGalleryImage(section, id)
}

export async function getMessages() {
  return supabaseApi.getMessages()
}

export async function deleteMessage(id) {
  return supabaseApi.deleteMessage(id)
}

export async function submitMessage(payload) {
  return supabaseApi.createMessage(payload)
}

export async function submitPreAppointment(payload) {
  return supabaseApi.createAppointment({
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    city: payload.city.trim(),
    specialty: payload.specialty,
    contact_preference: payload.contactPreference,
    callback_window: payload.callbackWindow,
    note: payload.note.trim(),
  })
}

export async function getAppointments() {
  return supabaseApi.getAppointments()
}

export async function updateAppointmentStatus(id, status) {
  return supabaseApi.updateAppointment(id, { status })
}

export async function deleteAppointment(id) {
  return supabaseApi.deleteAppointment(id)
}

export async function loginAdmin(email, password) {
  try {
    const data = await supabaseApi.signIn(email, password)
    const user = await supabaseApi.getAdminUser()
    if (!user) {
      await supabaseApi.signOut()
      return { error: 'Ce compte ne dispose pas des droits administrateur.' }
    }
    return { user, session: data.session }
  } catch (error) {
    return { error: error.message }
  }
}

export const logoutAdmin = () => supabaseApi.signOut()
export const getAdminUser = () => supabaseApi.getAdminUser()
export const onAuthStateChange = (callback) => supabaseApi.onAuthStateChange(callback)

export async function uploadMedia(file) {
  return supabaseApi.uploadMedia(file)
}

export async function deleteMedia(id, url) {
  return supabaseApi.deleteMedia(id, url)
}

export async function listMedia() {
  return supabaseApi.getMedia()
}

export async function getArticles(status) {
  return supabaseApi.getArticles(status)
}

export async function getArticle(id) {
  return supabaseApi.getArticle(id)
}

export async function createArticle(payload) {
  return supabaseApi.createArticle(payload)
}

export async function updateArticle(id, payload) {
  return supabaseApi.updateArticle(id, payload)
}

export async function deleteArticle(id) {
  return supabaseApi.deleteArticle(id)
}
