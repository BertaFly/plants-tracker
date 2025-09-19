import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import usePlantsStore from '../store/plantsStore'

const AuthWrapper = ({ children }) => {
  const { user, loading, signInAnonymous } = useAuth()
  const setUser = usePlantsStore(s => s.setUser)
  const loadPlants = usePlantsStore(s => s.loadPlants)

  useEffect(() => {
    if (user) {
      setUser(user)
      loadPlants(user.id)
    } else if (!loading) {
      // Auto sign-in anonymously if no user
      signInAnonymous().catch(console.error)
    }
  }, [user?.id, loading, setUser, loadPlants, signInAnonymous])

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your plants...</p>
        </div>
      </div>
    )
  }

  return children
}

export default AuthWrapper

