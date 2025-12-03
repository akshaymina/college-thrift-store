import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_BASE || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
})

// attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// log errors to help debug signup/login issues
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data
    const errors = data?.errors || data?.error || data?.message || err.message
    console.error('API error:', err?.response?.status, { data, errors })
    return Promise.reject(err)
  }
)

export default api
export { API_BASE, UPLOAD_BASE }
