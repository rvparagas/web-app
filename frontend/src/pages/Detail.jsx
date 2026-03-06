import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Detail.css'

const API = 'http://localhost:8080/api/user'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id === 'random') {
      fetchRandom()
    } else {
      fetchEntry(id)
    }
  }, [id])

  async function fetchEntry(entryId) {
    const res = await fetch(`${API}/${entryId}`)
    if (res.status === 404) { setNotFound(true); return }
    const data = await res.json()
    setEntry(data)
  }

  async function fetchRandom() {
    const res = await fetch(API)
    const data = await res.json()
    if (!data.length) { setNotFound(true); return }
    const pick = data[Math.floor(Math.random() * data.length)]
    setEntry(pick)
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
      <button className="btn-random" onClick={(fetchRandom)}>
        Random Entry
      </button>
    </div>
  )
}

export default Detail
