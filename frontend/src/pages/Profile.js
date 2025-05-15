// frontend/src/pages/Profile.js
import React from 'react';
import ImageUploader from '../components/ImageUploader';
import SavedImages from '../components/SavedImages';

function Profile({ userId }) {
  console.log("Рендер профілю з userId:", userId); // <-- ось тут

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    formData.append('userId', userId);

    await fetch('http://localhost:5000/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    window.location.reload(); // для оновлення списку
  };

  return (
    <div>
      <h2>Особиста сторінка</h2>
      <ImageUploader onImageChange={handleImageUpload} />
      <SavedImages userId={userId} />
    </div>
  );
}


export default Profile;
