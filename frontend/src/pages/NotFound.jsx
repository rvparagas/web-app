import { useNavigate } from 'react-router-dom'
import './Home.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notFound">
      <section className="hero">
        <h1>404 | Page Not Found</h1>
        <p className="subtitle">The page you're looking for doesn't exist or has been moved.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate(-1)}>Back</button>
            <button onClick={() => navigate('/')}>Home</button>
          </div>
      </section>
    </div>
  )
}

export default NotFound