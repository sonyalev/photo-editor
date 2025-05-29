import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Global.css';

function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        } else {
          setError(data.message || 'Помилка при отриманні повідомлень');
        }
      } catch (err) {
        setError('Помилка: ' + err.message);
      }
    };
    fetchMessages();
  }, []);

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
        <h1>Надіслані повідомлення</h1>
        {error && <p>{error}</p>}
        {messages.length === 0 && !error ? (
          <p>Повідомлення відсутні</p>
        ) : (
          <section>
            <ul className="messages-list">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <strong>{msg.first_name} {msg.last_name}</strong> ({msg.email})<br />
                  Тип запиту: {msg.inquiry_type}<br />
                  Повідомлення: {msg.message}<br />
                  <small>{new Date(msg.created_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <footer>
        <p>© 2025 Редактор фотографій</p>
      </footer>
    </div>
  );
}

export default Messages;