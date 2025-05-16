// frontebd/src/components/DownloadButton.js
import React from 'react';

function DownloadButton({ imageUrl, filename = 'image.png' }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Звільнення памʼяті
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Помилка при завантаженні:', error);
    }
  };

  return <button onClick={handleDownload}>Завантажити</button>;
}

export default DownloadButton;


