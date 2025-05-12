// server/routes/photos.js
const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};

router.post('/', authenticate, async (req, res) => {
  const { imageUrl } = req.body;
  const userId = req.user.userId;
  const result = await db.query(
    'INSERT INTO photos (user_id, image_url) VALUES ($1, $2) RETURNING *',
    [userId, imageUrl]
  );
  res.json(result.rows[0]);
});

router.get('/', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const result = await db.query(
    'SELECT * FROM photos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  res.json(result.rows);
});

module.exports = router;
