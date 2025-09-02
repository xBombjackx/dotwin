import React, { useState } from 'react';
import './App.css';
import ChatBox from './ChatBox';
import Settings from './Settings';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setShowSettings(false)}>Chat</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </nav>
      </header>
      <main>
        {showSettings ? <Settings /> : <ChatBox />}
      </main>
    </div>
  );
}

export default App;
