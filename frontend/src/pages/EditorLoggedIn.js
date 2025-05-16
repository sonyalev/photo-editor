// frontend/src/pages/EditorLoggedIn.js
// frontend/src/pages/EditorLoggedIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/Editor/FilterSelector';
import DownloadButton from '../components/DownloadButton';

function EditorLoggedIn() {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [filter, setFilter] = useState('none');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login');
  } else {
    const parsedUser = JSON.parse(user);
    setUserId(parsedUser.id);
  }

  const editImage = localStorage.getItem('editImageURL');
  if (editImage) {
    setImageURL(editImage);
    localStorage.removeItem('editImageURL'); // Щоб не залишалось після оновлення
  }
}, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageURL;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'edited-image.png');
        formData.append('userId', userId);

        try {
          const res = await fetch('http://localhost:5000/api/images/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            alert('Фото успішно збережено!');
            setImageURL(null); // опціонально очищаємо
          } else {
            alert('Помилка збереження фото');
          }
        } catch (err) {
          alert('Помилка сервера');
          console.error(err);
        }
      }, 'image/png');
    };
  };

  return (
    <div style={{ background: '#f0f8ff', padding: '20px', minHeight: '100vh' }}>
      <h2>Привіт! Ви увійшли. Це ваша особиста сторінка редактора</h2>

      {/* Кнопка переходу на сторінку збережених фото */}
      <button
        onClick={() => navigate('/saved-images')}
        style={{ marginBottom: '20px', padding: '8px 12px' }}
      >
        Переглянути збережені фото
      </button>

      <ImageUploader onImageChange={handleImageChange} />
      <FilterSelector filter={filter} onFilterChange={handleFilterChange} />

      {imageURL && (
        <>
          <ImagePreview image={imageURL} filter={filter} />
          <DownloadButton image={imageURL} />
          <button
            onClick={saveImage}
            style={{ marginLeft: '10px', padding: '8px 12px' }}
          >
            Зберегти фото
          </button>
        </>
      )}
    </div>
  );
}

export default EditorLoggedIn;



