const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const { first_name, last_name, email, inquiry_type, message } = req.body;
  try {
    if (!first_name || !last_name || !email || !inquiry_type || !message) {
      return res.status(400).json({ message: 'Усі поля обов’язкові' });
    }
    if (!['support', 'feedback', 'other'].includes(inquiry_type)) {
      return res.status(400).json({ message: 'Недопустимий тип запиту' });
    }

    const query = `
      INSERT INTO contacts (first_name, last_name, email, inquiry_type, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [first_name, last_name, email, inquiry_type, message];
    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Повідомлення збережено', data: result.rows[0] });
  } catch (err) {
    console.error('Помилка при збереженні повідомлення:', err);
    res.status(500).json({ message: 'Помилка при збереженні повідомлення' });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC;';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Помилка при отриманні повідомлень:', err);
    res.status(500).json({ message: 'Помилка при отриманні повідомлень' });
  }
});

module.exports = router;