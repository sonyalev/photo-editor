// backend/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // ← потрібно для роботи з файловими шляхами
require('dotenv').config();

// Ініціалізація Express
const app = express();

// Середовища
app.use(cors());
app.use(express.json());

// === Підключення маршрутів ===
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

app.use('/api/auth', authRoutes);
console.log('Маршрути auth підключено');

app.use('/api/images', imageRoutes);
console.log('Маршрути images підключено');

// === Статичні файли (зображення) ===
// Сервер дозволяє доступ до /uploads (для зображень)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Запуск сервера ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



