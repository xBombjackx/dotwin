import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function ChatBox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <span style={{ color: msg.color }}>{msg.username}</span>: {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBox;
