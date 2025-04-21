import React, { useState } from 'react';
import api from '../services/api';
import '../styles/ChatSQLPage.css';

export default function ChatSQLPage() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  const send = async () => {
    const prompt = input.trim();
    if (!prompt) return;
    setChat(c => [...c, { from: 'user', text: prompt }]);
    setInput('');
    try {
      const { data } = await api.post('/ai/query-sql', { prompt });
      if (data.success) {
        setChat(c => [...c, { from: 'ai', text: data.answer }]);
      } else {
        setChat(c => [...c, { from: 'ai', text: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setChat(c => [...c, { from: 'ai', text: `Error: ${err.message}` }]);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-sql-page">
      <div className="chat-window">
        {chat.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Haz tu pregunta sobre la base de datos..."
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
