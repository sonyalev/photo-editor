// frontend/src/pages/Home.js
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/FilterSelector';
import DownloadButton from '../components/DownloadButton';

function Home() {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState('none');

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
    <div style={{ padding: '20px' }}>
      <h2>Головна: Редагування доступне для всіх</h2>
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

export default Home;
