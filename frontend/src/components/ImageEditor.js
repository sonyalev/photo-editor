// frontend/src/components/ImageEditor.js
import React, { useRef, useState, useEffect } from 'react';
import FilterSelector from './Editor/FilterSelector';


function ImageEditor({ image, onSave, onSaveNew, onClose }) {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('none');


  // Завантажуємо зображення у canvas при зміні image
  useEffect(() => {
  if (!image) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = image.url;
  img.onload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filter;  // застосовуємо фільтр
    ctx.drawImage(img, 0, 0);
    setImageSrc(canvas.toDataURL());
  };
}, [image, filter]); // додаємо filter до залежностей


  // Логіка оновлення: видалити старе, потім створити нове
  const handleReplaceImage = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Помилка при отриманні файлу з canvas');
        setIsLoading(false);
        return;
      }

      try {
        // Видалити старе зображення
        let res = await fetch(`http://localhost:5000/api/images/${image.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Не вдалося видалити старе зображення');

        // Зберегти нове
        const formData = new FormData();
        formData.append('image', blob, 'edited-image.png');
        formData.append('userId', image.user_id);

        res = await fetch('http://localhost:5000/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Не вдалося зберегти нове зображення');

        const newImage = await res.json();
        onSaveNew(newImage.image); // передаємо нове зображення в пропси
        alert('Зображення оновлено (видалення + додавання)!');
      } catch (err) {
        alert('Помилка: ' + err.message);
      }

      setIsLoading(false);
    }, 'image/png');
  };

  // Зберегти як нове (без видалення)
  const handleSaveNew = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Помилка при отриманні файлу з canvas');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'edited-image.png');
      formData.append('userId', image.user_id);

      try {
        const res = await fetch('http://localhost:5000/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Не вдалося зберегти нове зображення');

        const newImage = await res.json();
        onSaveNew(newImage.image);
        alert('Нове зображення збережено!');
      } catch (err) {
        alert('Помилка при збереженні: ' + err.message);
      }
      setIsLoading(false);
    }, 'image/png');
  };

  // Видалити зображення
  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити це зображення?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Не вдалося видалити зображення');

      alert('Зображення видалено');
      onClose(); // Закриваємо редактор або оновлюємо список
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };


  if (!image) return <div>Оберіть зображення для редагування</div>;

  return (
    <div>
      <h3>Редагування зображення</h3>

      <FilterSelector filter={filter} onFilterChange={handleFilterChange} />

      <canvas
           ref={canvasRef}
           style={{
           border: '1px solid #000',
           cursor: 'crosshair',
           filter: filter, // <–– застосування CSS-фільтра
  }}
  onClick={FilterSelector}
/>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleReplaceImage} disabled={isLoading}>
          Замінити
        </button>
        <button onClick={handleSaveNew} disabled={isLoading}>
          Зберегти як нове
        </button>
        <button onClick={handleDelete} disabled={isLoading}>
          Видалити зображення
        </button>
        <button onClick={onClose} disabled={isLoading}>
          Відмінити
        </button>
      </div>
    </div>
  );
}

export default ImageEditor;
