// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');


// Маршрут для реєстрації користувачів
router.post('/register', async (req, res) => {
  console.log('Маршрут /api/auth/register викликано');
  console.log('Дані запиту:', req.body);
  const { email, password } = req.body;
  console.log('Запит на реєстрацію отримано:', req.body);

  try {
    // Хешуємо пароль перед збереженням в БД
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Збереження користувача в базі даних
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Користувач зареєстрований', user: result.rows[0] });
  } catch (err) {
    console.error('Помилка при реєстрації:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Маршрут для логіну користувача
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Знаходимо користувача по email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    const user = userResult.rows[0];

    // Порівнюємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неправильний пароль' });
    }

    // Повертаємо успішну відповідь (тут можна також додати токен, якщо будеш використовувати JWT)
    res.status(200).json({ message: 'Успішний вхід', user: { id: user.id, email: user.email } });

  } catch (err) {
    console.error('Помилка при вході:', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;



