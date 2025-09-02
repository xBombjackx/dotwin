require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const tmi = require('tmi.js');
const { LiveChat } = require('youtube-chat');
const { TikTokLiveConnection } = require('tiktok-live-connector');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors()); // Allow requests from the React app
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's default address
    methods: ["GET", "POST"]
  }
});

// --- Config Management ---
const configPath = './config.json';

const getConfig = () => {
  const rawdata = fs.readFileSync(configPath);
  return JSON.parse(rawdata);
};

const saveConfig = (config) => {
  const data = JSON.stringify(config, null, 2);
  fs.writeFileSync(configPath, data);
};

let twitchClient, youtubeChat, tiktokLiveConnection;

function initializeChatClients() {
  let config = getConfig();

  // --- Twitch Connection ---
  if (twitchClient) twitchClient.disconnect();
  twitchClient = new tmi.Client({
    channels: [ config.twitch.username ]
  });
  twitchClient.connect().catch(console.error);
  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return;
    const chatMessage = {
      platform: 'twitch',
      username: tags['display-name'],
      message: message,
      id: `twitch-${tags['id']}`,
      color: tags['color'] || '#FFFFFF'
    };
    io.emit('chat message', chatMessage);
  });

  // --- YouTube Connection ---
  if (youtubeChat) youtubeChat.stop();
  youtubeChat = new LiveChat({
    liveId: config.youtube.liveId
  });
  youtubeChat.start().catch(console.error);
  youtubeChat.on('message', (data) => {
    data.message.forEach(messageItem => {
      const chatMessage = {
        platform: 'youtube',
        username: data.author.name,
        message: messageItem.text || '',
        id: `youtube-${data.id}`,
        color: '#CCCCCC'
      };
      io.emit('chat message', chatMessage);
    });
  });
  youtubeChat.on('error', (err) => {
    console.error('YouTube Chat Error:', err);
  });

  // --- TikTok Connection ---
  if (tiktokLiveConnection) tiktokLiveConnection.disconnect();
  tiktokLiveConnection = new TikTokLiveConnection(config.tiktok.username);
  tiktokLiveConnection.connect().catch(err => console.error('Failed to connect to TikTok', err));
  tiktokLiveConnection.on('chat', data => {
    const chatMessage = {
        platform: 'tiktok',
        username: data.uniqueId,
        message: data.comment,
        id: `tiktok-${data.msgId}`,
        color: '#000000'
    };
    io.emit('chat message', chatMessage);
  });
}

app.get('/api/config', (req, res) => {
  res.json(getConfig());
});

app.post('/api/config', (req, res) => {
  saveConfig(req.body);
  res.json({ message: 'Config saved successfully. Re-initializing connections...' });
  initializeChatClients();
});

initializeChatClients();

const PORT = 3001; // Port for the backend server
server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});