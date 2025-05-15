// backend/src/routes/images.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// Налаштування multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Завантаження зображення
router.post('/upload', upload.single('image'), async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO images (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *',
      [userId, req.file.filename, req.file.path]
    );
    res.json({ message: 'Файл збережено', image: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Отримати всі фото користувача
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
