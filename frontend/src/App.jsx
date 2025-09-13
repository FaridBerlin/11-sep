
import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3000'

function App() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
              <strong>{msg.name}</strong>
              <p>{msg.message}</p>
              <button onClick={() => deleteMessage(msg.id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
