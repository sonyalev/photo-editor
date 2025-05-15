import React, { useState, useEffect } from 'react';

function EditorPage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const editImageURL = localStorage.getItem('editImageURL');
    if (editImageURL) {
      setImageSrc(editImageURL);
      localStorage.removeItem('editImageURL'); // очистити після використання
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageSrc && (
        <div>
          <img src={imageSrc} alt="Selected" style={{ maxWidth: '100%' }} />
          {/* Тут твій canvas/редактор */}
        </div>
      )}
    </div>
  );
}

export default EditorPage;
