// frontend/src/components/Contact.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa'; // Імпорт іконок
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
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
          </ul>
        </nav>
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅️ Назад
        </button>
      </header>
      <main>
        <h1>Контактна інформація</h1>
        <section className="contact-info">
          <div className="contact-details">
            <p>
              <FaEnvelope className="contact-icon" /> Зв'яжіться з нами:{' '}
              <a href="mailto:levchuk.sofia@lll.kpi.ua">levchuk.sofia@lll.kpi.ua</a>
            </p>
            <p>Телефон: +380 985 291 896</p>
            <p>
              
            </p>
          </div>
        </section>
        <section className="contact-form">
          <h2>Напишіть нам</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
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
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group form-group-icon">
              <label htmlFor="email">Електронна пошта</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ваша пошта"
                  required
                />
              </div>
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group">
              <label htmlFor="message">Повідомлення</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ваше повідомлення"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Надіслати
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </section>
        <section className="how-to-find">
          <h2></h2>
          <ol>
          </ol>
        </section>
        <section className="social-links">
          <h2>Ми в соціальних мережах</h2>
          <a
            href="https://www.linkedin.com/in/sofia-levchuk-98a4062a5/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaLinkedin className="social-icon" /> LinkedIn
          </a>
        </section>
      </main>
      <footer>
        <p>© 2025 Редактор фотографій</p>
      </footer>
    </div>
  );
}

export default Contact;
