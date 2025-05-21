// frontend/src/components/Contact.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Global.css';

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="global-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️ Назад
      </button>
      <h1>Контактна інформація</h1>
      <p>Зв'яжіться з нами за email: example@email.com</p>
      <p>Телефон: +123 456 7890</p>
    </div>
  );
}

export default Contact;