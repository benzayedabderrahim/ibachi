import axios from 'axios'

import { API_BASE, WHATSAPP_NUMBER } from './config'

const client = axios.create({ baseURL: `${API_BASE}/api` })

// Fetch products, optionally filtered (e.g. { category: 'women' }).
export async function fetchProducts(params = {}) {
  const { data } = await client.get('/produits/', { params })
  return data.results ?? data
}

// Build a WhatsApp deep link pre-filled with a message about a product.
export function buildWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// ---------- Customer feedback (public) ----------
export async function fetchFeedbacks() {
  const { data } = await client.get('/feedbacks/')
  return data.results ?? data
}

export async function createFeedback(name_user, description) {
  const { data } = await client.post('/feedbacks/', { name_user, description })
  return data
}

// ---------- Admin (secret page) ----------
const TOKEN_KEY = 'iba_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Token ${token}` } : {}
}

export async function adminLogin(username, password) {
  const { data } = await client.post('/auth/login/', { username, password })
  setToken(data.token)
  return data
}

// Create a product. `fields` is a plain object; `imageFile` is optional File.
export async function createProduct(fields, imageFile) {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => form.append(key, value))
  if (imageFile) form.append('image', imageFile)
  const { data } = await client.post('/produits/', form, { headers: authHeader() })
  return data
}

// Update a product. Only includes the image when a new file is provided,
// so leaving the file input empty keeps the existing photo.
export async function updateProduct(id, fields, imageFile) {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => form.append(key, value))
  if (imageFile) form.append('image', imageFile)
  const { data } = await client.patch(`/produits/${id}/`, form, { headers: authHeader() })
  return data
}

export async function deleteProduct(id) {
  await client.delete(`/produits/${id}/`, { headers: authHeader() })
}
