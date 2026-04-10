import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Notes</Link>
        <nav>
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          {isAuthenticated && (
            <Link to="/entries" className={pathname.startsWith('/entries') ? 'active' : ''}>Entries</Link>
          )}
        </nav>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="user-email">{user?.email}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`btn-auth ${pathname === '/login' ? 'active' : ''}`}>Sign In</Link>
              <Link to="/register" className="btn-auth btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
