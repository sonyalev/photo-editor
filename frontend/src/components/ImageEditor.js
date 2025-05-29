import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import Cropper from 'react-cropper';
import FilterSelector from './Editor/FilterSelector';
import '../styles/SavedImages.css';

function ImageEditor({ image, onSave, onSaveNew, onClose }) {
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('none');
  const [intensity, setIntensity] = useState(100);
  const [isCropping, setIsCropping] = useState(false);
  const [cropData, setCropData] = useState(null);

  useEffect(() => { 
    if (!image) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.url;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      
      const maxWidth = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      ctx.drawImage(img, 0, 0, width, height);
      setImageSrc(canvas.toDataURL());
    };
  }, [image, filter, intensity]);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      toast.error('Помилка при обрізанні зображення');
      return;
    }

    const croppedImage = croppedCanvas.toDataURL('image/png');
    setCropData(croppedImage);
    setIsCropping(false);

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
    toast.success('Обрізку застосовано!');
  };

  const getCssFilter = (filter, intensity) => {
    if (filter === 'none') return 'none';
    if (filter === 'hue-rotate') {
      return `${filter}(${intensity * 3.6}deg)`;
    } else if (filter === 'blur') {
      return `${filter}(${(intensity / 100) * 10}px)`;
    }
    return `${filter}(${intensity}%)`;
  };

  const handleReplaceImage = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Помилка при отриманні файлу з canvas');
        setIsLoading(false);
        return;
      }

      try {
        let res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/${image.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Не вдалося видалити старе зображення');

        const formData = new FormData();
        formData.append('image', blob, 'edited-image.png');
        formData.append('userId', image.user_id);

        res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Не вдалося зберегти нове зображення');

        const newImage = await res.json();
        onSaveNew(newImage.image);
        toast.success('Зображення успішно замінено!');
      } catch (err) {
        toast.error('Помилка: ' + err.message);
      }

      setIsLoading(false);
    }, 'image/png');
  };

  const handleSaveNew = async () => {
    setIsLoading(true);
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Помилка при отриманні файлу з canvas');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'edited-image.png');
      formData.append('userId', image.user_id);

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Не вдалося зберегти нове зображення');

        const newImage = await res.json();
        onSaveNew(newImage.image);
        toast.success('Нове зображення збережено!');
      } catch (err) {
        toast.error('Помилка при збереженні: ' + err.message);
      }
      setIsLoading(false);
    }, 'image/png');
  };

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити це зображення?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/${image.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Не вдалося видалити зображення');

      toast.success('Зображення видалено!');
      onClose();
    } catch (err) {
      toast.error('Помилка: ' + err.message);
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
    <div className="editor-container">
      <h3>Редагування зображення</h3>

      <FilterSelector
        filter={filter}
        intensity={intensity}
        onFilterChange={handleFilterChange}
        onIntensityChange={setIntensity}
      />

      <div className="editor-actions">
        <button className="custom-button" onClick={() => setIsCropping(!isCropping)} disabled={isLoading}>
          {isCropping ? 'Скасувати' : 'Обрізати зображення'}
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
          <button className="custom-button" onClick={handleCrop} style={{ marginTop: 10 }} disabled={isLoading}>
            Застосувати обрізку
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="editor-canvas"
          style={{
            border: '1px solid #000',
            cursor: 'crosshair',
            filter: getCssFilter(filter, intensity),
          }}
        />
      )}

      <div className="editor-actions">
        <button className="custom-button" onClick={handleReplaceImage} disabled={isLoading}>
          Замінити
        </button>
        <button className="custom-button" onClick={handleSaveNew} disabled={isLoading}>
          Зберегти як нове
        </button>
        <button className="custom-button" onClick={onClose} disabled={isLoading}>
          Відмінити
        </button>
      </div>
    </div>
  );
}

export default ImageEditor;