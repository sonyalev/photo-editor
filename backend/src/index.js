// backend/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// === WebSocket Server ===
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('🟢 Нове WebSocket з’єднання');
  ws.on('message', (message) => {
    console.log('📩 Повідомлення:', message.toString());
    ws.send(`Відповідь сервера: ${message}`);
  });
  ws.send('Підключено до WebSocket сервера!');
});

// === Middleware ===
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// === Routes ===
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const contactRoutes = require('./routes/contacts');

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);

// === Статичні файли ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Обробка помилок 404 ===
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ендпоінт не знайдено' });
});

// === Обробка помилок сервера ===
app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ message: 'Помилка сервера' });
});

// === Запуск сервера ===
server.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});


