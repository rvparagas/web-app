import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <h1>Notes</h1>
        <p className="subtitle">A commonplace book for passages, reflections, and ideas worth keeping.</p>
        <div className="hero-buttons">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/entries')}>Browse Entries</button>
              <button onClick={() => navigate('/entries/random')} className="btn-secondary">Random Entry</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/register')}>Get Started</button>
              <button onClick={() => navigate('/login')} className="btn-secondary">Sign In</button>
            </>
          )}
        </div>
      </section>
      <section className="features">
        <div className="feature-card">
          <h3>Collect</h3>
          <p>Save passages from books, essays, or your own thoughts.</p>
        </div>
        <div className="feature-card">
          <h3>Annotate</h3>
          <p>Add your own commentary alongside each entry.</p>
        </div>
        <div className="feature-card">
          <h3>Revisit</h3>
          <p>Browse your entries or open one at random.</p>
        </div>
      </section>
      <section className="features-extra">
        <div className="feature-card">
          <h3>Real-time Sync</h3>
          <p>See live updates when entries are created or modified.</p>
        </div>
        <div className="feature-card">
          <h3>Multi-user</h3>
          <p>Each user has their own private collection of notes.</p>
        </div>
        <div className="feature-card">
          <h3>Tag & Filter</h3>
          <p>Organize entries with tags and filter to find what you need.</p>
        </div>
      </section>
    </div>
  )
}

export default Home
