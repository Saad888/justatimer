import 'src/App.css'
import { useEffect } from 'react'
import { LoginPage } from 'src/pages/login'
import { useAuth } from 'src/context/AuthContext'
import { MainPage } from './pages/main'

function App () {
  const { currentUser } = useAuth()
  useEffect(() => {}, [])

  return (
    <div className='App'>
      {!currentUser && <LoginPage />}
      {currentUser && <MainPage />}
    </div>
  )
}

export default App
