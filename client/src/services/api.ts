const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const fetchWithErrorHandling = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export const categoryAPI = {
  getAll: async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/categories`)
      return data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  getById: async (id: string) => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`)
      return data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },
}

export const collectionAPI = {
  getAll: async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/collections`)
      return data
    } catch (error) {
      console.error('Error fetching collections:', error)
      throw error
    }
  },

  getById: async (id: string) => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/collections/${id}`)
      return data
    } catch (error) {
      console.error('Error fetching collection:', error)
      throw error
    }
  },
}

export const bookAPI = {
  getAll: async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/books`)
      return data
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },

  getById: async (id: string) => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/books/${id}`)
      return data
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  },
}
