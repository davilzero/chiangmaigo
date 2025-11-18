import apiClient from './client'

export interface Service {
  id: string
  name: string
  nameEn?: string
  nameZh?: string
  description: string
  category: string
  price: number
  images: string[]
  location: {
    address: string
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
  merchantId: string
  status: 'active' | 'pending' | 'suspended'
}

export const servicesApi = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const { data } = await apiClient.get('/services', { params })
    return data
  },
  
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/services/${id}`)
    return data
  },
  
  create: async (service: Partial<Service>) => {
    const { data } = await apiClient.post('/services', service)
    return data
  },
  
  update: async (id: string, service: Partial<Service>) => {
    const { data } = await apiClient.put(`/services/${id}`, service)
    return data
  },
  
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/services/${id}`)
    return data
  },
}

