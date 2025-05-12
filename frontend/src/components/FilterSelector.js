// frontebd/src/components/FilterSelector.js
import React from 'react';

function FilterSelector({ filter, onFilterChange }) {
  return (
    <div>
      <label>Фільтр: </label>
      <select onChange={onFilterChange} value={filter}>
        <option value="none">Без фільтру</option>
        <option value="grayscale(100%)">Чорно-білий</option>
        <option value="sepia(100%)">Сепія</option>
        <option value="invert(100%)">Інверсія кольорів</option>
      </select>
    </div>
  );
}

export default FilterSelector;
