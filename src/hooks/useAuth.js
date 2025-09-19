import { useState, useEffect } from 'react'
import { authService } from '../lib/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInAnonymous = async () => {
    try {
      const result = await authService.signInAnonymously()
      return result
    } catch (error) {
      console.error('Anonymous sign in failed:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await authService.signInWithGoogle()
      return result
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInAnonymous,
    signInWithGoogle,
    signOut
  }
}

