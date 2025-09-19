import { useState } from 'react'
import { format } from 'date-fns'
import usePlantsStore from '../store/plantsStore'
import PlantForm from './PlantForm'

const PlantList = () => {
  const { plants, removePlant, addWaterDate, addFertilizeDate } = usePlantsStore()
  const [editingPlant, setEditingPlant] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleWater = (plantId) => {
    addWaterDate(plantId, new Date().toISOString().split('T')[0])
  }

  const handleFertilize = (plantId) => {
    addFertilizeDate(plantId, new Date().toISOString().split('T')[0])
  }

  const handleTreatment = (plantId) => {
    const { addTreatmentDate } = usePlantsStore.getState()
    addTreatmentDate(plantId, new Date().toISOString().split('T')[0])
  }

  const getLastCareDate = (dates) => {
    if (!dates.length) return 'Never'
    const latest = dates.sort().pop()
    return format(new Date(latest), 'MMM dd')
  }

  return (
    <div className="plant-list">
      <div className="list-header">
        <h1>My Plants</h1>
        <button onClick={() => setShowForm(true)}>Add Plant</button>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state">
          <p>No plants yet. Add your first plant to get started!</p>
        </div>
      ) : (
        <div className="plants-grid">
          {plants.map(plant => (
            <div key={plant.id} className="plant-card">
              {plant.photo && (
                <div className="plant-image">
                  <img src={plant.photo} alt={plant.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                </div>
              )}
              <div className="plant-info">
                <h3>{plant.name}</h3>
              </div>
              
              <div className="care-info">
                <div className="care-item">
                  <span>💧 Last watered: {getLastCareDate(plant.wateredDates)}</span>
                </div>
                <div className="care-item">
                  <span>🌱 Last fertilized: {getLastCareDate(plant.fertilizedDates)}</span>
                </div>
                <div className="care-item">
                  <span>💊 Last treatment: {getLastCareDate(plant.treatmentDates || [])}</span>
                </div>
              </div>
              
              <div className="plant-actions">
                <button onClick={() => handleWater(plant.id)} className="water-btn">
                  💧 Water
                </button>
                <button onClick={() => handleFertilize(plant.id)} className="fertilize-btn">
                  🌱 Fertilize
                </button>
                <button onClick={() => handleTreatment(plant.id)} className="treatment-btn">
                  💊 Treatment
                </button>
                <button onClick={() => setEditingPlant(plant)} className="edit-btn">
                  ✏️
                </button>
                <button onClick={() => removePlant(plant.id)} className="delete-btn">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editingPlant) && (
        <PlantForm 
          plant={editingPlant}
          onClose={() => {
            setShowForm(false)
            setEditingPlant(null)
          }}
        />
      )}
    </div>
  )
}

export default PlantList
