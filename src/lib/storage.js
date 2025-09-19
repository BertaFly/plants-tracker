import { put, del } from '@vercel/blob'

export async function uploadImage(file, filename) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    })
    return blob.url
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}

export async function deleteImage(url) {
  try {
    await del(url)
  } catch (error) {
    console.error('Failed to delete image:', error)
    throw error
  }
}

export function generateImageFilename(userId, originalName) {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  return `plants/${userId}/${timestamp}.${extension}`
}
