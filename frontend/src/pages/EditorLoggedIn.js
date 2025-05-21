// frontend/src/pages/EditorLoggedIn.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-cropper';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import FilterSelector from '../components/Editor/FilterSelector';
import DownloadButton from '../components/DownloadButton';
import '../styles/EditorLoggedIn.css';
import 'cropperjs/dist/cropper.css';

function EditorLoggedIn() {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [filter, setFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);
  const [userId, setUserId] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const cropperRef = useRef(null);
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
    const f = FILTERS.find((f) => f.value === filter);
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
      setIsCropping(false);
      setShowFilterSelector(false);
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

    croppedCanvas.toBlob((blob) => {
      setImageFile(blob);
      setImageURL(croppedCanvas.toDataURL('image/png'));
      setIsCropping(false);
    }, 'image/png');
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
    img.crossOrigin = 'anonymous';
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
            setImageFile(null);
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
    <div className="editor-logged-in-container">
      <div className="header">
        <h2>Привіт! Ви увійшли. Це ваша особиста сторінка редактора</h2>
        <button
          className="saved-images-button"
          onClick={() => navigate('/saved-images')}
        >
          Переглянути збережені фото
        </button>
      </div>

      <ImageUploader onImageChange={handleImageChange} buttonClass="button-85" />

      {imageURL && (
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
                src={imageURL}
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
              <ImagePreview image={imageURL} cssFilter={getCssFilter(filter, intensity)} />
              <div className="editor-controls">
                <DownloadButton
                  imageUrl={imageURL}
                  cssFilter={getCssFilter(filter, intensity)}
                  filename="edited-image.png"
                  buttonClass="download-button"
                />
                <button className="download-button" onClick={saveImage}>
                  Зберегти фото
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default EditorLoggedIn;

