// frontend/src/components/SavedImages.js
import React, { useEffect, useState } from 'react';

function SavedImages({ userId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/images/user/${userId}`)
      .then(res => res.json())
      .then(data => setImages(data));
  }, [userId]);

  const handleDownload = (filepath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${filepath}`;
    link.download = filepath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h3>Збережені зображення:</h3>
      {images.map(img => (
        <div key={img.id}>
          <img
            src={`http://localhost:5000/${img.filepath}`}
            alt={img.filename}
            style={{ maxWidth: '300px' }}
          />
          <br />
          <button onClick={() => handleDownload(img.filepath)}>Зберегти фото</button>
        </div>
      ))}
    </div>
  );
}

export default SavedImages;
