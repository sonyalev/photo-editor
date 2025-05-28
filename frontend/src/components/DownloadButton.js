// frontebd/src/components/DownloadButton.js
import React from 'react';

function DownloadButton({ imageUrl, cssFilter = 'none', filename = 'edited-image.png', buttonClass }) {
  const handleDownload = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Не вдалося завантажити зображення'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.filter = cssFilter;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Не вдалося створити Blob');
            alert('Помилка при створенні файлу');
            return;
          }

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();

          window.URL.revokeObjectURL(url);
        },
        'image/png',
        1
      );
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
      alert('Помилка при завантаженні: ' + error.message);
    }
  };

  return (
  <button className={buttonClass} onClick={handleDownload}>
    Завантажити
  </button>
);
}

export default DownloadButton;

