import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Gets the 20 newest messages from the server
const fetchMessages = async () => {
  const res = await axios.get('/messages');
  return res.data;
};

function Dashboard({ name, email, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Load messages when the dashboard first appears
  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => setError('Could not load messages'));
  }, []);

  // Post a new message, then reload the list
  const handlePost = async () => {
    setError('');
    try {
      await axios.post('/messages', { name, text: newMessage });
      setNewMessage('');
      setMessages(await fetchMessages());
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not post message');
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <div className="user-greeting">
        <h3>Hello, {name}! </h3>
        <p>You've successfully logged in with: {email}</p>
      </div>
      <div className="dashboard-content">
        <p>You're looking handsome today, love ya!</p>
      </div>

      <div className="message-board">
        <h3>Message Board</h3>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button onClick={handlePost}>Post</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              <strong>{m.name}</strong>: {m.text}{' '}
              <small>{new Date(m.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;