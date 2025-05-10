import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null); // Стан для зображення
  const [filter, setFilter] = useState('none'); // Стан для фільтра

  // Функція для обробки зміни зображення
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Отримуємо файл
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Оновлюємо стан зображення
      };
      reader.readAsDataURL(file); // Читаємо зображення як Data URL
    }
  };

  // Функція для зміни фільтра
  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Оновлюємо стан фільтра
  };

  // Функція для збереження зображення
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d'); // Отримуємо контекст для малювання на канвасі
    
    const img = new Image(); // Створюємо нове зображення
    img.src = image; // Встановлюємо джерело зображення
    
    img.onload = () => {
      canvas.width = img.width; // Встановлюємо ширину канвасу відповідно до зображення
      canvas.height = img.height; // Встановлюємо висоту канвасу
      ctx.drawImage(img, 0, 0); // Малюємо зображення на канвасі
      
      // Створюємо посилання для завантаження
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png'); // Отримуємо Data URL зображення в форматі PNG
      link.download = 'edited_image.png'; // Назва файлу при завантаженні
      link.click(); // Симулюємо клік на лінк для завантаження
    };
  };

  return (
    <div className="App">
      <h1>Онлайн редактор фотографій</h1>
      
      {/* Вибір файлу */}
      <input 
        type="file" 
        onChange={handleImageChange} 
      />
      
      {/* Вибір фільтра */}
      <div>
        <label>Фільтр: </label>
        <select onChange={handleFilterChange} value={filter}>
          <option value="none">Без фільтру</option>
          <option value="grayscale(100%)">Чорно-білий</option>
          <option value="sepia(100%)">Сепія</option>
          <option value="invert(100%)">Інверсія кольорів</option>
        </select>
      </div>

      {/* Попередній перегляд зображення з фільтром */}
      {image && (
        <div>
          <h2>Попередній перегляд:</h2>
          <img 
            src={image} 
            alt="Uploaded preview" 
            style={{
              width: '100%', 
              maxHeight: '500px',
              filter: filter, // Застосовуємо вибраний фільтр
            }} 
          />
        </div>
      )}

      {/* Кнопка для завантаження відредагованого зображення */}
      {image && (
        <button onClick={downloadImage}>
          Завантажити відредаговане зображення
        </button>
      )}
    </div>
  );
}

export default App;


