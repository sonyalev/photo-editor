// frontebd/src/components/DownloadButton.js
import React from 'react';

function DownloadButton({ image }) {
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'edited_image.png';
      link.click();
    };
  };

  return (
    <button onClick={downloadImage}>
      Завантажити відредаговане зображення
    </button>
  );
}

export default DownloadButton;
