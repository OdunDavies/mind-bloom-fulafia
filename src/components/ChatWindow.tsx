import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/models/Message';

interface ChatWindowProps {
  messages: Message[];
  onSend: (content: string) => void;
  chatWith: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, chatWith }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window" style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, width: 350 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Chat with {chatWith}</div>
      <div style={{ height: 220, overflowY: 'auto', background: '#fafafa', marginBottom: 8, padding: 8 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: msg.from === chatWith ? 'bold' : 'normal' }}>{msg.from}: </span>
            <span>{msg.content}</span>
            <div style={{ fontSize: 10, color: '#999' }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            onSend(input.trim());
            setInput('');
          }
        }}
      >
        <input
          type="text"
          value={input}
          placeholder="Type a message"
          onChange={e => setInput(e.target.value)}
          style={{ width: '80%', marginRight: 8 }}
        />
        <button type="submit" style={{ width: '18%' }}>Send</button>
      </form>
    </div>
  );
};