import * as supabaseApi from './supabase.js'

const useSupabase = true;

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

export async function loginAdmin(email, password) {
  try {
    const data = await supabaseApi.signIn(email, password)
    localStorage.setItem('admin_token', data.session.access_token)
    return { token: data.session.access_token }
  } catch (error) {
    return { error: error.message }
  }
}

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
