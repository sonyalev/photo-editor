// frontend/src/components/About.js
// frontend/src/components/About.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Global.css';

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
        <section>
          <p>Це редактор фотографій, створений для легкого редагування зображень.</p>
          <img src="https://via.placeholder.com/150" alt="Editor preview" className="floating-left" />
          <p>Наш редактор дозволяє застосовувати фільтри, обрізати зображення та зберігати результати.</p>
        </section>
        <section>
          <h2>Особливості</h2>
          <ul>
            <li>Інтуїтивний інтерфейс</li>
            <li>Широкий вибір фільтрів</li>
            <li>Збереження в хмарі</li>
          </ul>
        </section>
        <section>
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
                <td>500+</td>
              </tr>
              <tr>
                <td>Зображень оброблено</td>
                <td>10,000+</td>
              </tr>
              <tr>
                <td>Дата запуску</td>
                <td>2025</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2>Галерея</h2>
          <div className="image-map-container">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Sample image"
              useMap="#image-map"
              className="floating-right"
            />
            <map name="image-map">
              <area shape="rect" coords="0,0,200,100" href="/saved-images" alt="Go to Saved Images" />
              <area shape="rect" coords="200,100,400,200" href="/contact" alt="Go to Contact" />
            </map>
            <img src="https://via.placeholder.com/100" alt="Icon" className="floating-fixed" />
          </div>
        </section>
      </main>
      <footer>
        <p>© 2025 Редактор фотографій</p>
      </footer>
    </div>
  );
}

export default About;