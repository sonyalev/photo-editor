// frontebd/src/components/DownloadButton.js
import React from 'react';

function DownloadButton({ imageUrl, cssFilter = 'none', filename = 'edited-image.png' }) {
  const handleDownload = async () => {
    try {
      // Створюємо зображення
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Для уникнення проблем з CORS
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Не вдалося завантажити зображення'));
      });

      // Створюємо canvas для рендерингу зображення з фільтрами
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Застосовуємо CSS-фільтр
      ctx.filter = cssFilter;
      ctx.drawImage(img, 0, 0);

      // Отримуємо Blob з canvas
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Не вдалося створити Blob');
            alert('Помилка при створенні файлу');
            return;
          }

          // Створюємо тимчасовий URL для завантаження
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();

          // Звільняємо пам’ять
          window.URL.revokeObjectURL(url);
        },
        'image/png', // Вказуємо формат
        1 // Якість (1 = максимальна)
      );
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
      alert('Помилка при завантаженні: ' + error.message);
    }
  };

  return <button onClick={handleDownload}>Завантажити</button>;
}

export default DownloadButton;

