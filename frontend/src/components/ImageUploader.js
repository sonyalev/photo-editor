// frontebd/src/components/ImageUploader.js
import React from 'react';

function ImageUploader({ onImageChange }) {
  return (
    <div>
      <input type="file" onChange={onImageChange} />
    </div>
  );
}

export default ImageUploader;
