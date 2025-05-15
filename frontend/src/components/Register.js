// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Імпортуємо useNavigate для перенаправлення


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message || 'Щось пішло не так');

    if (data.message === 'Користувач зареєстрований') {
      // Після успішної реєстрації перенаправляємо на сторінку редактора
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/editor');
    }
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логін"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Зареєструватися</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
