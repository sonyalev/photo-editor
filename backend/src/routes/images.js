// backend/src/routes/images.js
const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// Налаштування multer для збереження файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Завантаження нового зображення
router.post('/upload', upload.single('image'), async (req, res) => {
  const { userId } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не надано' });
    }

    const filePath = file.path.replace(/\\/g, '/');
    const filename = file.filename;

    const result = await pool.query(
      'INSERT INTO images (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *',
      [userId, filename, filePath]
    );

    const image = result.rows[0];
    image.url = `http://localhost:5000/uploads/${filename}`;

    res.json({ message: 'Файл збережено', image });
  } catch (err) {
    console.error('Помилка при збереженні зображення:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// заміна існуючого зображення за id
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не надано' });
    }

    const filePath = file.path.replace(/\\/g, '/');
    const filename = file.filename;

    // Оновлення запису у БД
    const result = await pool.query(
      'UPDATE images SET filename = $1, filepath = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [filename, filePath, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Зображення не знайдено або немає прав' });
    }

    const image = result.rows[0];
    image.url = `http://localhost:5000/uploads/${filename}`;

    res.json({ message: 'Зображення оновлено', image });
  } catch (err) {
    console.error('Помилка оновлення зображення:', err);
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

    const images = result.rows.map(img => ({
      ...img,
      url: `http://localhost:5000/uploads/${img.filename}`
    }));

    res.json({ images });
  } catch (err) {
    console.error('Помилка при отриманні зображень:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});



// Видалення зображення за id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Знаходимо шлях до файлу в БД
    const result = await pool.query('SELECT filepath FROM images WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Зображення не знайдено' });
    }

    const filePath = result.rows[0].filepath;

    // Видаляємо запис з БД
    await pool.query('DELETE FROM images WHERE id = $1', [id]);

    // Видаляємо файл з файлової системи (папка uploads)
    fs.unlink(path.resolve(filePath), (err) => {
      if (err) {
        console.error('Помилка видалення файлу:', err);
        // Не зупиняємо, просто логіруємо помилку
      }
    });

    res.json({ message: 'Зображення видалено' });
  } catch (err) {
    console.error('Помилка видалення зображення:', err);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});


module.exports = router;