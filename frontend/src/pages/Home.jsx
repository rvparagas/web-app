import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero">
        <h1>Notes</h1>
        <p className="subtitle">A commonplace book for passages, reflections, and ideas worth keeping.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/entries')}>Browse Entries</button>
            <button onClick={() => navigate('/entries/random')}>Random Entry</button>
          </div>
      </section>
      <section className="features">
        <div className="feature-card">
          <h3>Collect</h3>
          <p>Save passages from books, essays, or your own thought.</p>
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
    </div>
  )
}

export default Home
