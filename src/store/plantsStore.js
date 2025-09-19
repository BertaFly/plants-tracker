import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../lib/api'

const usePlantsStore = create(
  persist(
    (set, get) => ({
      plants: [],
      loading: false,
      error: null,
      user: null,

      setUser: (nextUser) => {
        const current = get().user
        if (current?.id === nextUser?.id) return
        set({ user: nextUser, plants: [] })
        if (nextUser) {
          get().loadPlants(nextUser.id)
        }
      },

      // Load plants for current user
      loadPlants: async (userId) => {
        if (!userId) return
        
        set({ loading: true, error: null })
        try {
          // For demo purposes, use local storage instead of API
          const plants = get().getLocalPlants(userId)
          set({ plants, loading: false })
        } catch (error) {
          console.error('Error loading plants:', error)
          set({ error: error.message, loading: false })
        }
      },

      // Get plants from localStorage (demo implementation)
      getLocalPlants: (userId) => {
        const allPlants = JSON.parse(localStorage.getItem('plants_storage') || '[]')
        return allPlants.filter(plant => plant.userId === userId)
      },

      // Save plants to localStorage (demo implementation)
      saveLocalPlants: (plants) => {
        const existingPlants = JSON.parse(localStorage.getItem('plants_storage') || '[]')
        const { user } = get()
        if (!user) return
        
        // Remove current user's plants and add updated ones
        const otherUsersPlants = existingPlants.filter(p => p.userId !== user.id)
        const allPlants = [...otherUsersPlants, ...plants.map(p => ({ ...p, userId: user.id }))]
        localStorage.setItem('plants_storage', JSON.stringify(allPlants))
      },

      addPlant: async (plantData) => {
        const { user, plants } = get()
        if (!user) throw new Error('User not authenticated')

        set({ loading: true, error: null })
        try {
          const newPlant = {
            ...plantData,
            id: Date.now().toString(),
            userId: user.id,
            createdAt: new Date().toISOString(),
            wateredDates: Array.isArray(plantData.wateredDates) ? plantData.wateredDates : [],
            fertilizedDates: Array.isArray(plantData.fertilizedDates) ? plantData.fertilizedDates : [],
            treatmentDates: Array.isArray(plantData.treatmentDates) ? plantData.treatmentDates : []
          }

          const updatedPlants = [newPlant, ...plants]
          set({ plants: updatedPlants, loading: false })
          get().saveLocalPlants(updatedPlants)
        } catch (error) {
          console.error('Error adding plant:', error)
          set({ error: error.message, loading: false })
        }
      },

      updatePlant: async (plantId, updates) => {
        set({ loading: true, error: null })
        try {
          const { plants } = get()
          const updatedPlants = plants.map(plant =>
            plant.id === plantId ? { ...plant, ...updates } : plant
          )
          set({ plants: updatedPlants, loading: false })
          get().saveLocalPlants(updatedPlants)
        } catch (error) {
          console.error('Error updating plant:', error)
          set({ error: error.message, loading: false })
        }
      },

      removePlant: async (plantId) => {
        set({ loading: true, error: null })
        try {
          const { plants } = get()
          const updatedPlants = plants.filter(plant => plant.id !== plantId)
          set({ plants: updatedPlants, loading: false })
          get().saveLocalPlants(updatedPlants)
        } catch (error) {
          console.error('Error removing plant:', error)
          set({ error: error.message, loading: false })
        }
      },

      addWaterDate: async (plantId, date) => {
        const { plants } = get()
        const plant = plants.find(p => p.id === plantId)
        if (!plant) return

        const updatedDates = [...(plant.wateredDates || []), date]
        await get().updatePlant(plantId, { wateredDates: updatedDates })
      },

      addFertilizeDate: async (plantId, date) => {
        const { plants } = get()
        const plant = plants.find(p => p.id === plantId)
        if (!plant) return

        const updatedDates = [...(plant.fertilizedDates || []), date]
        await get().updatePlant(plantId, { fertilizedDates: updatedDates })
      },

      addTreatmentDate: async (plantId, date) => {
        const { plants } = get()
        const plant = plants.find(p => p.id === plantId)
        if (!plant) return

        const updatedDates = [...(plant.treatmentDates || []), date]
        await get().updatePlant(plantId, { treatmentDates: updatedDates })
      },

      removeCareDate: async (plantId, date, type) => {
        const { plants } = get()
        const plant = plants.find(p => p.id === plantId)
        if (!plant) return

        const dateField = type === 'water' ? 'wateredDates' : 
                         type === 'fertilize' ? 'fertilizedDates' : 'treatmentDates'
        
        const updatedDates = (plant[dateField] || []).filter(d => d !== date)
        await get().updatePlant(plantId, { [dateField]: updatedDates })
      },

      // Upload image using Vercel Blob
      uploadImage: async (file) => {
        const { user } = get()
        if (!user) throw new Error('User not authenticated')

        try {
          // For demo, convert to base64 and store locally
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.readAsDataURL(file)
          })
        } catch (error) {
          console.error('Error uploading image:', error)
          throw error
        }
      }
    }),
    {
      name: 'plants-storage',
      // Only persist user and basic state, not the plants array
      partialize: (state) => ({ user: state.user })
    }
  )
)

export default usePlantsStore