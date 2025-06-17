const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Тест підключення до бази
pool.connect((err, client, release) => {
  if (err) {
    console.error('Помилка підключення до бази:', err.stack);
    return;
  }
  console.log('Підключено до PostgreSQL');
  release();
});

const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  console.log('🟢 Нове WebSocket з’єднання');
  ws.on('message', (message) => {
    console.log('📩 Повідомлення:', message.toString());
    ws.send(`Відповідь сервера: ${message}`);
  });
  ws.send('Підключено до WebSocket сервера!');
});

app.use(cors({
  origin: 'https://photo-editor-5e1o4bczi-sofias-projects-677fb3cd.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const contactRoutes = require('./routes/contacts');

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ендпоінт не знайдено' });
});

app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ message: 'Помилка сервера' });
});

server.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
