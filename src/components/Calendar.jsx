import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns'
import usePlantsStore from '../store/plantsStore'

const Calendar = () => {
  const { plants, addWaterDate, addFertilizeDate, addTreatmentDate, removeCareDate } = usePlantsStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handleCareChange = (plantId, date, selectedState) => {
    if (!plantId || !date) return
    
    const dateStr = format(date, 'yyyy-MM-dd')
    const plant = plants.find(p => p.id === plantId)
    if (!plant) return
    
    // Clear all existing care for this date
    removeCareDate(plantId, dateStr, 'water')
    removeCareDate(plantId, dateStr, 'fertilize')
    removeCareDate(plantId, dateStr, 'treatment')
    
    // Add care based on selected state
    switch (selectedState) {
      case 'water':
        addWaterDate(plantId, dateStr)
        break
      case 'fertilize':
        addFertilizeDate(plantId, dateStr)
        break
      case 'treatment':
        addTreatmentDate(plantId, dateStr)
        break
      case 'water-fertilize':
        addWaterDate(plantId, dateStr)
        addFertilizeDate(plantId, dateStr)
        break
      case 'water-treatment':
        addWaterDate(plantId, dateStr)
        addTreatmentDate(plantId, dateStr)
        break
      case 'fertilize-treatment':
        addFertilizeDate(plantId, dateStr)
        addTreatmentDate(plantId, dateStr)
        break
      case 'all':
        addWaterDate(plantId, dateStr)
        addFertilizeDate(plantId, dateStr)
        addTreatmentDate(plantId, dateStr)
        break
      case 'empty':
      default:
        // Already cleared above
        break
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getCellState = (plant, date) => {
    if (!plant || !date) return 'empty'
    
    const dateStr = format(date, 'yyyy-MM-dd')
    const isWatered = (plant.wateredDates || []).includes(dateStr)
    const isFertilized = (plant.fertilizedDates || []).includes(dateStr)
    const isTreated = (plant.treatmentDates || []).includes(dateStr)
    
    if (isWatered && isFertilized && isTreated) return 'all'
    if (isWatered && isFertilized && !isTreated) return 'water-fertilize'
    if (isWatered && !isFertilized && isTreated) return 'water-treatment'
    if (!isWatered && isFertilized && isTreated) return 'fertilize-treatment'
    if (isWatered && !isFertilized && !isTreated) return 'water'
    if (!isWatered && isFertilized && !isTreated) return 'fertilize'
    if (!isWatered && !isFertilized && isTreated) return 'treatment'
    return 'empty'
  }

  if (plants.length === 0) {
    return (
      <div className="calendar">
        <div className="calendar-header">
          <h2>Care Calendar</h2>
        </div>
        <div className="empty-state">
          <p>No plants to track. Add some plants first!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>Care Calendar</h2>
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)}>‹</button>
          <h3>{format(currentDate, 'MMMM yyyy')}</h3>
          <button onClick={() => navigateMonth(1)}>›</button>
        </div>
      </div>

      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead>
            <tr>
              <th className="plant-column">Plant</th>
              {days.map(day => (
                <th key={day.toString()} className={`date-column ${isToday(day) ? 'today' : ''}`}>
                  <div className="date-header">
                    <div className="day-number">{format(day, 'd')}</div>
                    <div className="day-name">{format(day, 'EEE')}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plants.map(plant => (
              <tr key={plant.id}>
                <td className="plant-cell">
                  <div className="plant-info">
                    <span className="plant-name">{plant.name}</span>
                  </div>
                </td>
                {days.map(day => {
                  const cellState = getCellState(plant, day)
                  return (
                    <td key={`${plant.id}-${day.toString()}`} className="date-cell">
                      <select 
                        className={`care-dropdown ${cellState}`}
                        value={cellState}
                        onChange={(e) => handleCareChange(plant.id, day, e.target.value)}
                      >
                        <option value="empty">-</option>
                        <option value="water">💧 Water</option>
                        <option value="fertilize">🌱 Fertilize</option>
                        <option value="treatment">💊 Treatment</option>
                        <option value="water-fertilize">💧🌱 Water + Fertilize</option>
                        <option value="water-treatment">💧💊 Water + Treatment</option>
                        <option value="fertilize-treatment">🌱💊 Fertilize + Treatment</option>
                        <option value="all">💧🌱💊 All Care</option>
                      </select>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Calendar
