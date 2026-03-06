import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EntryCard.css'

function EntryCard({ entry, onDelete, onUpdate }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    passage: entry.passage,
    source: entry.source,
    commentary: entry.commentary,
    tag: entry.tag,
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    await onUpdate(entry._id, form)
    setEditing(false)
  }

  return (
    <div className="entry-card">
      {editing ? (
        <div className="entry-edit">
          <textarea name="passage" value={form.passage} onChange={handleChange} rows={3} placeholder="Passage" />
          <input name="source" value={form.source} onChange={handleChange} placeholder="Source" />
          <textarea name="commentary" value={form.commentary} onChange={handleChange} rows={2} placeholder="Commentary" />
          <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag" />
          <div className="entry-actions">
            <button onClick={handleSave}>Save</button>
            <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="entry-view">
          <p className="entry-passage">"{entry.passage}"</p>
          <p className="entry-source">— {entry.source}</p>
          {entry.commentary && <p className="entry-commentary">{entry.commentary}</p>}
          {entry.tag && <span className="entry-tag">{entry.tag}</span>}
          <div className="entry-actions">
            <button className="btn-ghost" onClick={() => navigate(`/entries/${entry._id}`)}>Read</button>
            <button className="btn-ghost" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn-danger" onClick={() => onDelete(entry._id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EntryCard
