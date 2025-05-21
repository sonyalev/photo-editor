// frontebd/src/components/FilterSelector.js
import React from 'react';
import '../../styles/Home.css';

const FILTERS = [
  { name: 'Без фільтру', value: 'none', unit: '' },
  { name: 'Чорно-білий', value: 'grayscale', unit: '%' },
  { name: 'Сепія', value: 'sepia', unit: '%' },
  { name: 'Інверсія', value: 'invert', unit: '%' },
  { name: 'Розмиття', value: 'blur', unit: 'px' },
  { name: 'Яскравість', value: 'brightness', unit: '%' },
  { name: 'Контраст', value: 'contrast', unit: '%' },
  { name: 'Зміна відтінку', value: 'hue-rotate', unit: 'deg' },
  { name: 'Насиченість', value: 'saturate', unit: '%' },
  { name: 'Прозорість', value: 'opacity', unit: '%' },
];

function FilterSelector({ filter, intensity, onFilterChange, onIntensityChange }) {
  return (
    <div className="filter-selector" style={{ marginTop: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className="filter-button"
            onClick={() => onFilterChange(f.value)}
            style={{
              fontWeight: filter === f.value ? 'bold' : 'normal',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {filter !== 'none' && (
        <div style={{ marginTop: '20px' }}>
          <label>Інтенсивність: {intensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </div>
      )}
    </div>
  );
}

export default FilterSelector;
