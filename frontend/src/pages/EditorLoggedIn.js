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
  const [intensity, setIntensity] = useState(100);
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
      localStorage.removeItem('editImageURL');
    }
  }, [navigate]);

  const FILTERS = [
    { name: 'Без фільтру', value: 'none', unit: '' },
    { name: 'Чорно-білий', value: 'grayscale', unit: '%' },
    { name: 'Сепія', value: 'sepia', unit: '%' },
    { name: 'Інверсія', value: 'invert', unit: '%' },
    { name: 'Розмиття', value: 'blur', unit: 'px' },
    { name: 'Яскравість', value: 'brightness', unit: '%' },
    { name: 'Контраст', value: 'contrast', unit: '%' },
    { name: 'Зміна відтінку', value: 'hue-rotate', unit: 'deg' },
    { name: 'Насиченість', value: 'saturate', unit: '%' },
    { name: 'Прозорість', value: 'opacity', unit: '%' },
  ];

  const getCssFilter = (filter, intensity) => {
    if (filter === 'none') return 'none';

    const f = FILTERS.find(f => f.value === filter);
    if (!f) return 'none';

    let val = intensity;
    if (f.unit === 'deg') val = intensity * 3.6;
    else if (f.unit === 'px') val = (intensity / 100) * 10;

    return `${filter}(${val}${f.unit})`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
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

      ctx.filter = getCssFilter(filter, intensity);
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
            setImageURL(null);
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

      <button
        onClick={() => navigate('/saved-images')}
        style={{ marginBottom: '20px', padding: '8px 12px' }}
      >
        Переглянути збережені фото
      </button>

      <ImageUploader onImageChange={handleImageChange} />
      <FilterSelector
        filter={filter}
        intensity={intensity}
        onFilterChange={handleFilterChange}
        onIntensityChange={handleIntensityChange}
      />

      {imageURL && (
        <>
          <ImagePreview image={imageURL} cssFilter={getCssFilter(filter, intensity)} />
          <DownloadButton image={imageURL} cssFilter={getCssFilter(filter, intensity)} />
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




