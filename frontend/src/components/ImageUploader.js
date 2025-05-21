// frontebd/src/components/ImageUploader.js
import React from 'react';

function ImageUploader({ onImageChange, buttonClass }) {
  const handleInputChange = (e) => {
    console.log('Input change triggered:', e.target.files); // Дебаг: чи викликається подія
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0].name); // Дебаг: ім’я файлу
      onImageChange(e);
    } else {
      console.log('No file selected');
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked'); // Дебаг: чи реєструється клік на кнопці
    const input = document.getElementById('image-upload');
    if (input) {
      input.click(); // Програмно викликаємо клік на input
      console.log('Programmatically triggered input click');
    } else {
      console.error('Input element not found');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <button
          className={buttonClass}
          type="button"
          onClick={handleButtonClick}
          style={{ cursor: 'pointer' }}
        >
          Вибрати файл
        </button>
      </label>
    </div>
  );
}

export default ImageUploader;