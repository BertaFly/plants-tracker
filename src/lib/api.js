// API client for communicating with backend services

class ApiClient {
  constructor() {
    this.baseUrl = import.meta.env.PROD ? 'https://your-app.vercel.app' : 'http://localhost:5173'
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Plant operations
  async getPlants(userId) {
    return this.request(`/plants?userId=${userId}`)
  }

  async createPlant(userId, plantData) {
    return this.request('/plants', {
      method: 'POST',
      body: { userId, ...plantData }
    })
  }

  async updatePlant(plantId, userId, updates) {
    return this.request(`/plants/${plantId}`, {
      method: 'PUT',
      body: { userId, ...updates }
    })
  }

  async deletePlant(plantId, userId) {
    return this.request(`/plants/${plantId}`, {
      method: 'DELETE',
      body: { userId }
    })
  }

  // Care record operations
  async addCareRecord(plantId, careType, careDate, notes) {
    return this.request('/care-records', {
      method: 'POST',
      body: { plantId, careType, careDate, notes }
    })
  }

  async removeCareRecord(plantId, careType, careDate) {
    return this.request('/care-records', {
      method: 'DELETE',
      body: { plantId, careType, careDate }
    })
  }

  async getCareRecords(userId, startDate, endDate) {
    const params = new URLSearchParams({
      userId,
      startDate,
      endDate
    })
    return this.request(`/care-records?${params}`)
  }

  // Image upload
  async uploadImage(file, userId) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData
    })
  }
}

export const apiClient = new ApiClient()
