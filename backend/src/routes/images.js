// backend/src/routes/images.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// === Налаштування multer для збереження файлів ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Зберігаємо в src/uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// === Завантаження зображення ===
router.post('/upload', upload.single('image'), async (req, res) => {
  const { userId } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не надано' });
    }

    const filePath = file.path.replace(/\\/g, '/'); // для Windows-сумісності
    const filename = file.filename;

    const result = await pool.query(
      'INSERT INTO images (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *',
      [userId, filename, filePath]
    );

    const image = result.rows[0];
    image.url = `http://localhost:5000/uploads/${filename}`; // Додаємо абсолютний URL

    res.json({ message: 'Файл збережено', image });
  } catch (err) {
    console.error('Помилка при збереженні зображення:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// === Отримати всі фото для конкретного користувача ===
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );

    const images = result.rows.map(img => ({
      ...img,
      url: `http://localhost:5000/uploads/${img.filename}` // Додаємо абсолютний URL
    }));

    res.json({ images });
  } catch (err) {
    console.error('Помилка при отриманні зображень:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;

