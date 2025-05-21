// frontend/src/components/SavedImages.js
import React, { useEffect, useState } from 'react';
import ImageEditor from './ImageEditor';
import DownloadButton from './DownloadButton';
import '../styles/SavedImages.css'; 

function SavedImages({ userId }) {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/images/user/${userId}`);
        const data = await res.json();
        setImages(data.images);
      } catch (err) {
        console.error('Помилка при завантаженні зображень:', err);
      }
    };
    if (userId) fetchImages();
  }, [userId]);

  const handleSave = (updatedImage) => {
    setImages((imgs) =>
      imgs.map((img) => (img.id === updatedImage.id ? updatedImage : img))
    );
    setEditingImage(null);
  };

  const handleSaveNew = (newImage) => {
    setImages((imgs) => [newImage, ...imgs]);
    setEditingImage(null);
  };

  return (
    <div>
      <h2></h2>
      {editingImage ? (
        <ImageEditor
          image={editingImage}
          onSave={handleSave}
          onSaveNew={handleSaveNew}
          onClose={() => setEditingImage(null)}
        />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((img) => (
            <div key={img.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <img src={img.url} alt="saved" width={200} />
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button className="custom-button" onClick={() => window.open(img.url, '_blank')}>
                  <span>Переглянути</span>
                </button>
                <DownloadButton imageUrl={img.url} buttonClass="custom-button" />
                <button className="custom-button" onClick={() => setEditingImage(img)}>
                  <span>Редагувати</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedImages;

