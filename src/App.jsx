import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import usePlantsStore from './store/plantsStore'
import PlantList from './components/PlantList'
import Calendar from './components/Calendar'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('plants')
  const { user, signInWithGoogle, signInAnonymous, signOut, loading } = useAuth()
  const { setUser } = usePlantsStore()

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  useEffect(() => {
    // Auto sign in anonymously if no user
    if (!loading && !user) {
      signInAnonymous().catch(console.error)
    }
  }, [loading, user, signInAnonymous])

  return (
    <div className="app">
      <nav className="nav-tabs">
        <div className="auth-controls" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {user && !user.isAnonymous ? (
            <>
              <span style={{ fontSize: 12 }}>Signed in as {user.displayName || user.email}</span>
              <button onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
        </div>
        <button 
          className={activeTab === 'plants' ? 'active' : ''} 
          onClick={() => setActiveTab('plants')}
        >
          🌿 My Plants
        </button>
        <button 
          className={activeTab === 'calendar' ? 'active' : ''} 
          onClick={() => setActiveTab('calendar')}
        >
          📅 Care Calendar
        </button>
      </nav>

      {activeTab === 'plants' && <PlantList />}
      {activeTab === 'calendar' && <Calendar />}
    </div>
  )
}

export default App
