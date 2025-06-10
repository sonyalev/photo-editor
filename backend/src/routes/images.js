const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const pool = require('../config/db');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'photo-editor',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  const { userId } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не надано' });
    }

    const result = await pool.query(
      'INSERT INTO images (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *',
      [userId, file.filename, file.path]
    );

    const image = result.rows[0];
    image.url = file.path;

    res.json({ message: 'Файл збережено', image });
  } catch (err) {
    console.error('Помилка при збереженні зображення:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не надано' });
    }

    const result = await pool.query(
      'UPDATE images SET filename = $1, filepath = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [file.filename, file.path, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Зображення не знайдено або немає прав' });
    }

    const image = result.rows[0];
    image.url = file.path;

    res.json({ message: 'Зображення оновлено', image });
  } catch (err) {
    console.error('Помилка оновлення зображення:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );

    const images = result.rows.map(img => ({
      ...img,
      url: img.filepath,
    }));

    res.json({ images });
  } catch (err) {
    console.error('Помилка при отриманні зображень:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT filepath, filename FROM images WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Зображення не знайдено' });
    }

    const { filename } = result.rows[0];

    await cloudinary.uploader.destroy(filename);

    await pool.query('DELETE FROM images WHERE id = $1', [id]);

    res.json({ message: 'Зображення видалено' });
  } catch (err) {
    console.error('Помилка видалення зображення:', err);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;