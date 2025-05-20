// frontend/src/components/ImageEditor.js
import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'react-cropper';
import FilterSelector from './Editor/FilterSelector'; 

function ImageEditor({ image, onSave, onSaveNew, onClose }) {
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);
  const [isCropping, setIsCropping] = useState(false);
  const [cropData, setCropData] = useState(null);

  // Завантажуємо зображення у canvas при зміні image, filter або intensity
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

      // Обчислити CSS-фільтр з інтенсивністю
      let filterValue = 'none';
      if (filter !== 'none') {
        if (filter === 'hue-rotate') {
          filterValue = `${filter}(${intensity * 3.6}deg)`;
        } else if (filter === 'blur') {
          filterValue = `${filter}(${(intensity / 100) * 10}px)`;
        } else {
          filterValue = `${filter}(${intensity}%)`;
        }
      }

      ctx.filter = filterValue;
      ctx.drawImage(img, 0, 0);
      setImageSrc(canvas.toDataURL());
    };
  }, [image, filter, intensity]);

  // Обробка обрізки
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      alert('Помилка при обрізанні зображення');
      return;
    }

    // Зберігаємо обрізане зображення у вигляді Data URL
    const croppedImage = croppedCanvas.toDataURL('image/png');
    setCropData(croppedImage);
    setIsCropping(false);

    // Оновлюємо canvas з обрізаним зображенням
    const img = new Image();
    img.src = croppedImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.filter = getCssFilter(filter, intensity);
      ctx.drawImage(img, 0, 0);
      setImageSrc(croppedImage);
    };
  };

  // Обчислення CSS-фільтру
  const getCssFilter = (filter, intensity) => {
    if (filter === 'none') return 'none';
    if (filter === 'hue-rotate') {
      return `${filter}(${intensity * 3.6}deg)`;
    } else if (filter === 'blur') {
      return `${filter}(${(intensity / 100) * 10}px)`;
    }
    return `${filter}(${intensity}%)`;
  };

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
        onSaveNew(newImage.image);
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
      onClose();
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'none') setIntensity(100);
    else setIntensity(50);
  };

  if (!image) return <div>Оберіть зображення для редагування</div>;

  return (
    <div>
      <h3>Редагування зображення</h3>

      <FilterSelector
        filter={filter}
        intensity={intensity}
        onFilterChange={handleFilterChange}
        onIntensityChange={setIntensity}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setIsCropping(!isCropping)} disabled={isLoading}>
          {isCropping ? 'Закрити обрізку' : 'Обрізати зображення'}
        </button>
      </div>

      {isCropping ? (
        <div style={{ marginTop: 10 }}>
          <Cropper
            src={image.url}
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
          <button onClick={handleCrop} style={{ marginTop: 10 }} disabled={isLoading}>
            Застосувати обрізку
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid #000',
            cursor: 'crosshair',
            filter: getCssFilter(filter, intensity),
          }}
        />
      )}

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