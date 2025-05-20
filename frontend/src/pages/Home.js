// frontend/src/pages/Home.js
import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
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

  const f = FILTERS.find((f) => f.value === filter);
  if (!f) return 'none';

  let val = intensity;
  if (f.unit === 'deg') val = intensity * 3.6;
  else if (f.unit === 'px') val = (intensity / 100) * 10;

  return `${filter}(${val}${f.unit})`;
}

function Home() {
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);
  const [isCropping, setIsCropping] = useState(false);
  const cropperRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setIsCropping(false);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      alert('Помилка при обрізанні зображення');
      return;
    }

    setImage(croppedCanvas.toDataURL('image/png'));
    setIsCropping(false);
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

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setIsCropping(!isCropping)}>
          {isCropping ? 'Закрити обрізку' : 'Обрізати зображення'}
        </button>
      </div>

      {image && (
        <>
          {isCropping ? (
            <div style={{ marginTop: 10 }}>
              <Cropper
                src={image}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                viewMode={1}
                minCropBoxWidth={100}
                minCropBoxHeight={100}
                background={false}
                responsive={true}
                autoCropArea={0.8}
                checkCrossOrigin={true}
                ref={cropperRef}
              />
              <button onClick={handleCrop} style={{ marginTop: 10 }}>
                Застосувати обрізку
              </button>
            </div>
          ) : (
            <>
              <ImagePreview image={image} cssFilter={getCssFilter(filter, intensity)} />
              <DownloadButton
                imageUrl={image}
                cssFilter={getCssFilter(filter, intensity)}
                filename="edited-image.png"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;