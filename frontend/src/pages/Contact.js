// frontend/src/components/Contact.js
// frontend/src/components/Contact.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Global.css';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    inquiry_type: 'support',
    message: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Ваше повідомлення надіслано!');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          inquiry_type: 'support',
          message: '',
        });
      } else {
        setMessage(data.message || 'Помилка при відправці');
      }
    } catch (err) {
      setMessage('Помилка: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="global-container">
      <header>
        <nav>
          <ul>
            <li><Link to="/about">Про проект</Link></li>
            <li><Link to="/contact">Контакти</Link></li>
            <li><Link to="/saved-images">Збережені зображення</Link></li>
            <li><Link to="/messages">Повідомлення</Link></li>
          </ul>
        </nav>
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅️ Назад
        </button>
      </header>
      <main>
        <h1>Контактна інформація</h1>
        <section>
          <img src="https://via.placeholder.com/150" alt="Contact icon" className="floating-left" />
          <p>Зв'яжіться з нами за email: levchuk.sofia@lll.kpi.ua</p>
          <p>Телефон: +380 985 291</p>
        </section>
        <section>
          <h2>Напишіть нам</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">Ім'я</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ваше ім'я"
              required
            />
            <label htmlFor="last_name">Прізвище</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Ваше прізвище"
              required
            />
            <label htmlFor="email">Електронна пошта</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ваша пошта"
              required
            />
            <label htmlFor="inquiry_type">Тип запиту</label>
            <select
              id="inquiry_type"
              name="inquiry_type"
              value={formData.inquiry_type}
              onChange={handleChange}
            >
              <option value="support">Підтримка</option>
              <option value="feedback">Відгук</option>
              <option value="other">Інше</option>
            </select>
            <label htmlFor="message">Повідомлення</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ваше повідомлення"
              required
            />
            <button type="submit">Надіслати</button>
          </form>
          {message && <p>{message}</p>}
        </section>
        <section>
          <h2>Як нас знайти</h2>
          <ol>
            <li>Відкрийте наш сайт</li>
            <li>Перейдіть до розділу контактів</li>
            <li>Заповніть форму або зателефонуйте</li>
          </ol>
        </section>
        <section>
          <img src="https://via.placeholder.com/100" alt="Social media icon" />
        </section>
      </main>
      <footer>
        <p>© 2025 Редактор фотографій</p>
      </footer>
    </div>
  );
}

export default Contact;