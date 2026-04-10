import { useState, useEffect, useRef } from 'react'
import EntryCard from '../components/EntryCard'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import './Entries.css'

const API = 'http://localhost:8080/api/user'

function Entries() {
  const [entries, setEntries] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [form, setForm] = useState({ passage: '', source: '', commentary: '', tag: '' })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const { socket, emitTyping } = useSocket()
  const typingTimeoutRef = useRef(null)

  const tags = [...new Set(entries.map(e => e.tag).filter(Boolean))]
  const filtered = selectedTag ? entries.filter(e => e.tag === selectedTag) : entries

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  useEffect(() => {
    fetchEntries()
  }, [token])

  useEffect(() => {
    if (!socket) return

    const handleCreated = (entry) => {
      setEntries(prev => [entry, ...prev])
    }

    const handleUpdated = (entry) => {
      setEntries(prev => prev.map(e => e._id === entry._id ? entry : e))
    }

    const handleDeleted = ({ _id }) => {
      setEntries(prev => prev.filter(e => e._id !== _id))
    }

    socket.on('entry:created', handleCreated)
    socket.on('entry:updated', handleUpdated)
    socket.on('entry:deleted', handleDeleted)

    return () => {
      socket.off('entry:created', handleCreated)
      socket.off('entry:updated', handleUpdated)
      socket.off('entry:deleted', handleDeleted)
    }
  }, [socket])

  async function fetchEntries() {
    try {
      const res = await fetch(API, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setEntries(data)
    } catch (err) {
      setError('Failed to load entries')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    
    emitTyping(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 1000)
  }

  async function handleCreate() {
    if (!form.passage.trim() || !form.source.trim()) {
      setError('Passage and source are required.')
      return
    }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to create')
      setForm({ passage: '', source: '', commentary: '', tag: '' })
      setShowForm(false)
      setError(null)
      emitTyping(false)
    } catch (err) {
      setError('Failed to create entry')
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (err) {
      setError('Failed to delete entry')
    }
  }

  async function handleUpdate(id, data) {
    try {
      await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(data),
      })
    } catch (err) {
      setError('Failed to update entry')
    }
  }

  return (
    <div className="entries">
      <div className="entries-header">
        <h1>Entries</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {showForm && (
        <div className="entry-form">
          {error && <p className="form-error">{error}</p>}
          <textarea name="passage" value={form.passage} onChange={handleChange} rows={3} placeholder="Passage *" />
          <input name="source" value={form.source} onChange={handleChange} placeholder="Source *" />
          <textarea name="commentary" value={form.commentary} onChange={handleChange} rows={2} placeholder="Commentary" />
          <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag" />
          <button onClick={handleCreate}>Save Entry</button>
        </div>
      )}

      {tags.length > 0 && (
        <div className="tag-filters">
          {tags.map(tag => (
            <button
              key={tag}
              className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0
        ? <p className="empty">No entries yet. Add one above.</p>
        : filtered.map(entry => (
            <EntryCard
              key={entry._id}
              entry={entry}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
      }
    </div>
  )
}

export default Entries
