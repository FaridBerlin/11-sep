
import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editMessage, setEditMessage] = useState('')

  // Load messages
  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/messages`)
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      setError('Failed to load messages')
    }
  }

  // Add message
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() })
      })
      
      if (response.ok) {
        setName('')
        setMessage('')
        fetchMessages()
      } else {
        setError('Failed to send message')
      }
    } catch (err) {
      setError('Failed to send message')
    }
    setLoading(false)
  }

  // Delete message
  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/messages/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchMessages()
      }
    } catch (err) {
      setError('Failed to delete message')
    }
  }

  // Start editing
  const startEdit = (msg) => {
    setEditingId(msg.id)
    setEditName(msg.name)
    setEditMessage(msg.message)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditMessage('')
  }

  // Save edit
  const saveEdit = async (id) => {
    if (!editName.trim() || !editMessage.trim()) return

    try {
      const response = await fetch(`${API_BASE}/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), message: editMessage.trim() })
      })
      
      if (response.ok) {
        setEditingId(null)
        setEditName('')
        setEditMessage('')
        fetchMessages()
      } else {
        setError('Failed to update message')
      }
    } catch (err) {
      setError('Failed to update message')
    }
  }

  return (
    <div className="app">
      <h1>🏠 Mini-Gästebuch</h1>
      
      {error && (
        <div className="error" onClick={() => setError('')}>
          {error} ✕
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Nachricht"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : '📝 Senden'}
        </button>
      </form>

      <div className="messages">
        <h2>💬 Nachrichten ({messages.length})</h2>
        {messages.length === 0 ? (
          <p>Noch keine Nachrichten vorhanden.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="message">
              {editingId === msg.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                  />
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Nachricht"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => saveEdit(msg.id)}>💾 Speichern</button>
                    <button onClick={cancelEdit}>❌ Abbrechen</button>
                  </div>
                </div>
              ) : (
                <>
                  <strong>{msg.name}</strong>
                  <p>{msg.message}</p>
                  <div className="message-buttons">
                    <button onClick={() => startEdit(msg)}>✏️</button>
                    <button onClick={() => deleteMessage(msg.id)}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
