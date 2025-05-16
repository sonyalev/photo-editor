// frontend/src/pages/Home.js
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/Editor/FilterSelector';
import DownloadButton from '../components/DownloadButton';

const FILTERS = [
  { value: 'none', unit: '' },
  { value: 'grayscale', unit: '%' },
  { value: 'sepia', unit: '%' },
  { value: 'invert', unit: '%' },
  { value: 'blur', unit: 'px' },
  { value: 'brightness', unit: '%' },
  { value: 'contrast', unit: '%' },
  { value: 'hue-rotate', unit: 'deg' },
  { value: 'saturate', unit: '%' },
  { value: 'opacity', unit: '%' },
];

function getCssFilter(filter, intensity) {
  if (filter === 'none') return 'none';

  const f = FILTERS.find(f => f.value === filter);
  if (!f) return 'none';

  let val = intensity;
  if (f.unit === 'deg') val = intensity * 3.6;       // 0-100% -> 0-360deg
  else if (f.unit === 'px') val = (intensity / 100) * 10;  // наприклад 0-10px

  return `${filter}(${val}${f.unit})`;
}

function Home() {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Головна: Редагування доступне для всіх</h2>

      <ImageUploader onImageChange={handleImageChange} />

      <FilterSelector
        filter={filter}
        intensity={intensity}
        onFilterChange={handleFilterChange}
        onIntensityChange={handleIntensityChange}
      />

      {image && (
  <>
    <ImagePreview image={image} cssFilter={getCssFilter(filter, intensity)} />
    <DownloadButton
      imageUrl={image} // Змінено з image на imageUrl
      cssFilter={getCssFilter(filter, intensity)} // Додаємо cssFilter
      filename="edited-image.png"
    />
  </>
)}
    </div>
  );
}

export default Home;
