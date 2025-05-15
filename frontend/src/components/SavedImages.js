// frontend/src/components/SavedImages.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SavedImages({ userId }) {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/images/user/${userId}`);
        const data = await res.json();
        setImages(data.images);
      } catch (err) {
        console.error('Помилка при завантаженні зображень:', err);
      }
    };

    if (userId) fetchImages();
  }, [userId]);


  const handleOptionClick = (image, option) => {
    if (option === 'view') {
      window.open(image.url, '_blank');
    } else if (option === 'download') {
      const a = document.createElement('a');
      a.href = image.url;
      a.download = 'image.png';
      a.click();
    } else if (option === 'edit') {
      localStorage.setItem('editImageURL', image.url); // Зберігаємо URL в локальне сховище
      navigate('/editor'); // Перенаправлення
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ваші збережені фото</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={img.url} alt="saved" width="200" />
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleOptionClick(img, 'view')}>Переглянути</button>
              <button onClick={() => handleOptionClick(img, 'download')}>Завантажити</button>
              <button onClick={() => handleOptionClick(img, 'edit')}>Редагувати</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedImages;
