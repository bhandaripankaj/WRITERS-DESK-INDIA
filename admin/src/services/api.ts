import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh')
}

export const categoryAPI = {
  getAll: () => apiClient.get('/categories'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  create: (data: any) => apiClient.post('/categories', data,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`)
}

export const collectionAPI = {
  getAll: () => apiClient.get('/collections'),
  getById: (id: string) => apiClient.get(`/collections/${id}`),
  create: (data: any) => apiClient.post('/collections', data),
  update: (id: string, data: any) => apiClient.put(`/collections/${id}`, data),
  delete: (id: string) => apiClient.delete(`/collections/${id}`)
}

export const bookAPI = {
  getAll: () => apiClient.get('/books'),
  getById: (id: string) => apiClient.get(`/books/${id}`),
  create: (data: any) => apiClient.post('/books', data),
  update: (id: string, data: any) => apiClient.put(`/books/${id}`, data),
  delete: (id: string) => apiClient.delete(`/books/${id}`)
}

export default apiClient
