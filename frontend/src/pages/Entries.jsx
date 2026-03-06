import { useState, useEffect } from 'react'
import EntryCard from '../components/EntryCard'
import './Entries.css'

const API = 'http://localhost:8080/api/user'

function Entries() {
  const [entries, setEntries] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [form, setForm] = useState({ passage: '', source: '', commentary: '', tag: '' })
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  const tags = [...new Set(entries.map(e => e.tag).filter(Boolean))]
  const filtered = selectedTag ? entries.filter(e => e.tag === selectedTag) : entries

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const res = await fetch(API)
    const data = await res.json()
    setEntries(data)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleCreate() {
    if (!form.passage.trim() || !form.source.trim()) {
      setError('Passage and source are required.')
      return
    }
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ passage: '', source: '', commentary: '', tag: '' })
    setShowForm(false)
    setError(null)
    fetchEntries()
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchEntries()
  }

  async function handleUpdate(id, data) {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchEntries()
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
