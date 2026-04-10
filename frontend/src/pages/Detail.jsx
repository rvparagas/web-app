import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Detail.css'

const API = 'http://localhost:8080/api/user'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [entry, setEntry] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const authHeaders = {
    'Authorization': `Bearer ${token}`
  }

  useEffect(() => {
    if (id === 'random') {
      fetchRandom()
    } else {
      fetchEntry(id)
    }
  }, [id, token])

  async function fetchEntry(entryId) {
    try {
      const res = await fetch(`${API}/${entryId}`, { headers: authHeaders })
      if (res.status === 404 || res.status === 401) { setNotFound(true); return }
      const data = await res.json()
      setEntry(data)
    } catch {
      setNotFound(true)
    }
  }

  async function fetchRandom() {
    try {
      const res = await fetch(API, { headers: authHeaders })
      if (!res.ok) { setNotFound(true); return }
      const data = await res.json()
      if (!data.length) { setNotFound(true); return }
      const pick = data[Math.floor(Math.random() * data.length)]
      setEntry(pick)
    } catch {
      setNotFound(true)
    }
  }

  if (notFound) return (
    <div className="detail-empty">
      <p>Entry not found.</p>
      <button onClick={() => navigate('/entries')}>Back to Entries</button>
    </div>
  )

  if (!entry) return <p className="detail-loading">Loading...</p>

  return (
    <div className="detail">
      <button className="btn-back" onClick={() => navigate('/entries')}>← Back</button>
      <article className="detail-article">
        <p className="detail-passage">"{entry.passage}"</p>
        <p className="detail-source">— {entry.source}</p>
        {entry.commentary && (
          <div className="detail-commentary">
            <h3>Commentary</h3>
            <p>{entry.commentary}</p>
          </div>
        )}
        {entry.tag && <span className="detail-tag">{entry.tag}</span>}
      </article>
      <button className="btn-random" onClick={fetchRandom}>
        Random Entry
      </button>
    </div>
  )
}

export default Detail
