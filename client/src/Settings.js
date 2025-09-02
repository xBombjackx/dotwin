import React, { useState, useEffect } from 'react';

function Settings() {
  const [config, setConfig] = useState({ twitch: { username: '' }, youtube: { liveId: '' }, tiktok: { username: '' } });

  useEffect(() => {
    fetch('http://localhost:3001/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [platform, key] = name.split('.');
    setConfig(prevConfig => ({
      ...prevConfig,
      [platform]: {
        ...prevConfig[platform],
        [key]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.error('Failed to save config:', err));
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <h2>Twitch</h2>
        <label>
          Username:
          <input type="text" name="twitch.username" value={config.twitch.username} onChange={handleChange} />
        </label>
        <br />
        <h2>YouTube</h2>
        <label>
          Live ID:
          <input type="text" name="youtube.liveId" value={config.youtube.liveId} onChange={handleChange} />
        </label>
        <br />
        <h2>TikTok</h2>
        <label>
          Username:
          <input type="text" name="tiktok.username" value={config.tiktok.username} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Settings;
