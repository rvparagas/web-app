import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import ActivityFeed from './components/ActivityFeed'
import Home from './pages/Home'
import Entries from './pages/Entries'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <p className="loading">Loading...</p>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  
  return children
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Navbar />
      {isAuthenticated && <ActivityFeed />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/entries" element={
            <ProtectedRoute>
              <Entries />
            </ProtectedRoute>
          } />
          <Route path="/entries/:id" element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
