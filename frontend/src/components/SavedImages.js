// frontend/src/components/SavedImages.js
// frontend/src/components/SavedImages.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ImageEditor from './ImageEditor';
import DownloadButton from './DownloadButton';
import ConfirmModal from './ConfirmModal';
import '../styles/SavedImages.css';

function SavedImages({ userId }) {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/user/${userId}`);
        const data = await res.json();
        setImages(data.images);
      } catch (err) {
        console.error('Помилка при завантаженні зображень:', err);
        toast.error('Помилка при завантаженні зображень');
      }
    };
    if (userId) fetchImages();
  }, [userId]);

  const handleSave = (updatedImage) => {
    setImages((imgs) =>
      imgs.map((img) => (img.id === updatedImage.id ? updatedImage : img))
    );
    setEditingImage(null);
    // Видалено toast.success, оскільки сповіщення генерується в ImageEditor.js
  };

  const handleSaveNew = (newImage) => {
    setImages((imgs) => [newImage, ...imgs]);
    setEditingImage(null);
    // Видалено toast.success, оскільки сповіщення генерується в ImageEditor.js
  };

  const handleDelete = async (imageId) => {
    setImageToDelete(imageId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/images/${imageToDelete}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Не вдалося видалити зображення');

      // Оновлюємо список зображень
      setImages((imgs) => imgs.filter((img) => img.id !== imageToDelete));
      // Видалено toast.success, оскільки сповіщення генерується в ImageEditor.js
    } catch (err) {
      toast.error('Помилка: ' + err.message);
    } finally {
      setIsModalOpen(false);
      setImageToDelete(null);
    }
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
                <button className="custom-button" onClick={() => handleDelete(img.id)}>
                  <span>Видалити</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Ви впевнені, що хочете видалити це зображення?"
      />
    </div>
  );
}

export default SavedImages;

