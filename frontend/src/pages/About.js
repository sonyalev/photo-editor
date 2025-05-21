// frontend/src/components/About.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Global.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="global-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️ Назад
      </button>
      <h1>Про проект</h1>
      <p>Це редактор фотографій, створений для легкого редагування зображень.</p>
    </div>
  );
}

export default About;