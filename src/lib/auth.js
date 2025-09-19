// Simple auth implementation using localStorage for demo
// In production, you'd want to use NextAuth.js or similar

export class AuthService {
  constructor() {
    this.currentUser = null
    this.listeners = new Set()
    this.init()
  }

  init() {
    // Check for existing session
    const savedUser = localStorage.getItem('plants_user')
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
    }
  }

  // Simulate Google sign in
  async signInWithGoogle() {
    try {
      // In a real app, this would integrate with Google OAuth
      const mockUser = {
        id: Date.now(),
        email: 'user@example.com',
        name: 'Demo User',
        provider: 'google',
        isAnonymous: false
      }
      
      this.currentUser = mockUser
      localStorage.setItem('plants_user', JSON.stringify(mockUser))
      this.notifyListeners()
      return mockUser
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    }
  }

  // Anonymous sign in
  async signInAnonymously() {
    try {
      const anonUser = {
        id: Date.now(),
        email: `anon_${Date.now()}@temp.com`,
        name: 'Anonymous User',
        provider: 'anonymous',
        isAnonymous: true
      }
      
      this.currentUser = anonUser
      localStorage.setItem('plants_user', JSON.stringify(anonUser))
      this.notifyListeners()
      return anonUser
    } catch (error) {
      console.error('Anonymous sign in failed:', error)
      throw error
    }
  }

  async signOut() {
    this.currentUser = null
    localStorage.removeItem('plants_user')
    this.notifyListeners()
  }

  getCurrentUser() {
    return this.currentUser
  }

  onAuthStateChanged(callback) {
    this.listeners.add(callback)
    // Immediately call with current state
    callback(this.currentUser)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser))
  }
}

// Export singleton instance
export const authService = new AuthService()
