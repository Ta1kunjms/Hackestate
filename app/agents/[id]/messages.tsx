'use client';
import React, { useState } from 'react';

export default function AgentMessages() {
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Hi! How can I help you?' },
    { from: 'purchaser', text: 'I am interested in your Modern Loft listing.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'purchaser', text: input }]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow mt-8">
      <h2 className="text-lg font-bold mb-4">Message Agent</h2>
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded mb-4 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'purchaser' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg text-sm ${msg.from === 'purchaser' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
} 