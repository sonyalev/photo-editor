// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Підключення маршрутів
const authRoutes = require('./routes/auth');


console.log('Маршрути auth підключено');

const app = express();
app.use(cors());
app.use(express.json()); // Для обробки JSON в запитах

// Підключення маршрутів
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


const imageRoutes = require('./routes/images');
app.use('/api/images', imageRoutes);

app.use('/src/uploads', express.static('src/uploads'));
