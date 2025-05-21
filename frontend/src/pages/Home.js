// frontend/src/pages/Home.js
import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/Editor/FilterSelector';
import DownloadButton from '../components/DownloadButton';
import '../styles/Home.css';
import 'cropperjs/dist/cropper.css';

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
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const cropperRef = useRef(null);

  const handleImageChange = (e) => {
    console.log('Home: handleImageChange triggered:', e.target.files);
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log('Home: Image URL created:', imageUrl);
      setImage(imageUrl);
      setIsCropping(false);
      setShowFilterSelector(false);
    } else {
      console.log('Home: No file selected');
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      console.error('Cropper not initialized');
      return;
    }

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      alert('Помилка при обрізанні зображення');
      return;
    }

    const croppedImage = croppedCanvas.toDataURL('image/png');
    console.log('Home: Cropped image:', croppedImage);
    setImage(croppedImage);
    setIsCropping(false);
  };

  const handleFilterChange = (filterValue) => {
    console.log('Filter changed to:', filterValue);
    setFilter(filterValue);
  };

  const handleIntensityChange = (value) => {
    console.log('Intensity changed to:', value);
    setIntensity(value);
  };

  return (
    <div className="home-container">
      <div className="page-title">
        <h1>Редактор фотографій</h1>
      </div>

      <ImageUploader onImageChange={handleImageChange} buttonClass="button-85" />

      {image && (
        <>
          <div className="editor-controls">
            <button
              className="gradient-button"
              onClick={() => {
                console.log('Toggle filter selector:', !showFilterSelector);
                setShowFilterSelector(!showFilterSelector);
              }}
            >
              {showFilterSelector ? 'Сховати фільтри' : 'Фільтр'}
            </button>
            <button
              className="gradient-button"
              onClick={() => {
                console.log('Toggle cropping:', !isCropping);
                setIsCropping(!isCropping);
              }}
            >
              {isCropping ? 'Скасувати' : 'Обрізати'}
            </button>
          </div>

          {showFilterSelector && (
            <FilterSelector
              filter={filter}
              intensity={intensity}
              onFilterChange={handleFilterChange}
              onIntensityChange={handleIntensityChange}
            />
          )}

          {isCropping && (
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '800px' }}>
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
              <div className="editor-controls" style={{ marginTop: '20px' }}>
                <button className="gradient-button" onClick={handleCrop}>
                  Застосувати
                </button>
              </div>
            </div>
          )}

          {!isCropping && (
            <>
              <ImagePreview image={image} cssFilter={getCssFilter(filter, intensity)} />
              <DownloadButton
                imageUrl={image}
                cssFilter={getCssFilter(filter, intensity)}
                filename="edited-image.png"
                buttonClass="download-button"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;