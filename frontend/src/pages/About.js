// frontend/src/components/About.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPaintBrush, FaCloudUploadAlt, FaUsers, FaImage, FaEdit, FaLinkedin } from 'react-icons/fa';
import '../styles/Global.css';
import sepiaImage from '../assets/images/sepia.png'; // Імпорт зображень
import cropImage from '../assets/images/crop.png';
import vividImage from '../assets/images/vivid.png';

function About() {
  const navigate = useNavigate();

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
        <h1>Про проект</h1>
        <section className="about-intro">
          <p>
            Наш редактор фотографій створений для того, щоб зробити редагування зображень простим і
            доступним для всіх. Незалежно від вашого рівня підготовки, ви можете легко застосовувати
            фільтри, обрізати зображення, регулювати кольори та зберігати результати в хмарі.
          </p>
          <button
            className="try-editor-button"
            onClick={() => navigate('/editor')}
          >
            <FaEdit className="button-icon" />
            
            Спробувати редактор
          </button>
        </section>
        <section className="features">
          <h2>Особливості</h2>
          <ul>
            <li>
              <FaPaintBrush className="feature-icon" /> Інтуїтивний інтерфейс для швидкого
              редагування
            </li>
            <li>
              <FaImage className="feature-icon" /> Можливість вибирати фільтри та ефекти
            </li>
            <li>
              <FaCloudUploadAlt className="feature-icon" /> Збереження в хмарі для доступу з
              будь-якого пристрою
            </li>
          </ul>
        </section>
        <section className="statistics">
          <h2>Статистика проєкту</h2>
          <table>
            <thead>
              <tr>
                <th>Показник</th>
                <th>Значення</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Кількість користувачів</td>
                <td>10+</td>
              </tr>
              <tr>
                <td>Зображень оброблено</td>
                <td>100+</td>
              </tr>
              <tr>
                <td>Дата запуску</td>
                <td>травень 2025</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="gallery">
          <h2>Галерея</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src={sepiaImage} alt="Sepia filter" />
              <p>Фільтр "Сепія"</p>
            </div>
            <div className="gallery-item">
              <img src={cropImage} alt="Cropped image" />
              <p>Обрізка зображення</p>
            </div>
            <div className="gallery-item">
              <img src={vividImage} alt="Vivid colors" />
              <p>Яскраві кольори</p>
            </div>
          </div>
        </section>
        <section className="team">
          <h2>Розробник Левчук Софія</h2>
          <p>
          
          </p>
        </section>
      </main>
      <footer>
        <p>© 2025 Редактор фотографій</p>
      </footer>
    </div>
  );
}

export default About;