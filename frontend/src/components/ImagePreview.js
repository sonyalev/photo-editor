// frontebd/src/components/ImagePreview.js
import React from 'react';

function ImagePreview({ image, cssFilter }) {
  return (
    <div>
      <h2></h2>
      <img 
        src={image} 
        alt="Uploaded preview" 
        style={{
          width: '100%',
          maxHeight: '500px',
          filter: cssFilter
        }} 
      />
    </div>
  );
}


export default ImagePreview;
