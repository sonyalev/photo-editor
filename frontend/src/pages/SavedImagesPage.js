// frontend/src/pages/SavedImagesPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SavedImages from '../components/SavedImages';
import '../styles/SavedImages.css'; 

function SavedImagesPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  if (!userId) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ваші збережені зображення</h2>
      <button className="custom-button" onClick={() => navigate('/editor')}>
        <span>⬅️ Назад</span>
      </button>
      <SavedImages userId={userId} />
    </div>
  );
}

export default SavedImagesPage;
