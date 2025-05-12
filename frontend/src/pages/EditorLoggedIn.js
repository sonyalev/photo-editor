// src/pages/EditorLoggedIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/FilterSelector';
import DownloadButton from '../components/DownloadButton';

function EditorLoggedIn() {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    // Якщо немає даних про користувача (не увійшов), редірект на сторінку входу
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div style={{ background: '#f0f8ff', padding: '20px', minHeight: '100vh' }}>
      <h2>Привіт! Ви увійшли. Це ваша особиста сторінка редактора</h2>
      <ImageUploader onImageChange={handleImageChange} />
      <FilterSelector filter={filter} onFilterChange={handleFilterChange} />
      {image && (
        <>
          <ImagePreview image={image} filter={filter} />
          <DownloadButton image={image} />
        </>
      )}
    </div>
  );
}

export default EditorLoggedIn;
