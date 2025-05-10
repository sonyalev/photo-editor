import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
  };

  return (
    <div className="App">
      <h1>Онлайн редактор фото</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Завантажене фото" style={{ maxWidth: '80%', marginTop: '20px' }} />}
    </div>
  );
}

export default App;

