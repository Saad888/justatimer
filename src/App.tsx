import React, { useEffect } from 'react'
import './App.css'
import { LoginPage } from './pages/login'
import { useAuth } from './context/AuthContext'

function App () {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const { currentUser } = useAuth()
  // User from auth

  useEffect(() => {}, [])

  return (
    <div className='App'>
      <p>Display Name: {currentUser?.displayName}</p>
      <LoginPage />
    </div>
  )
}

export default App
