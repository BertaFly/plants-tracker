import { useState } from 'react'
import usePlantsStore from '../store/plantsStore'

const PlantForm = ({ plant, onClose }) => {
  const { addPlant, updatePlant, uploadImage } = usePlantsStore()
  const [name, setName] = useState(plant?.name || '')
  const [photo, setPhoto] = useState(plant?.photo || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      setPhotoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        console.log('File read complete, setting photo preview')
        setPhoto(reader.result)
      }
      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setUploading(true)
      let photoUrl = photo

      // Upload new image if selected
      if (photoFile) {
        photoUrl = await uploadImage(photoFile)
      }

      const plantData = { 
        name: name.trim(),
        photo: photoUrl
      }
      
      if (plant) {
        await updatePlant(plant.id, plantData)
      } else {
        await addPlant(plantData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving plant:', error)
      alert('Error saving plant. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="plant-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{plant ? 'Edit Plant' : 'Add New Plant'}</h2>
        
        <input
          type="text"
          placeholder="Plant name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="photo-upload">
          <label htmlFor="photo">Plant Photo</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {photo && (
            <div className="photo-preview">
              <img 
                src={photo} 
                alt="Plant preview" 
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '4px' }} 
                onLoad={() => console.log('Image loaded successfully')}
                onError={(e) => console.error('Image failed to load:', e)}
              />
            </div>
          )}
          {photo && <p style={{ fontSize: '12px', color: '#666' }}>Preview: {photo.substring(0, 50)}...</p>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={uploading}>Cancel</button>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlantForm
