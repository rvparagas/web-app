import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Notes</Link>
        <nav>
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/entries" className={pathname.startsWith('/entries') ? 'active' : ''}>Entries</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
