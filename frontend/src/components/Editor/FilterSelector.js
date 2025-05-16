// frontebd/src/components/FilterSelector.js
import React, { useState } from 'react';

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
  const [showFilters, setShowFilters] = useState(false);

  // Кнопка "Фільтр" відкриває список
  const toggleFilters = () => setShowFilters(!showFilters);

  // Формуємо CSS filter рядок, наприклад: "sepia(50%)"
  const getCssFilter = () => {
    if (filter === 'none') return 'none';
    const f = FILTERS.find(f => f.value === filter);
    if (!f) return 'none';

    let val = intensity;
    if (f.unit === 'deg') val = intensity * 3.6; // 0-100% -> 0-360deg
    else if (f.unit === 'px') val = (intensity / 100) * 10; // наприклад до 10px розмиття

    return `${filter}(${val}${f.unit})`;
  };

  return (
    <div>
      <button onClick={toggleFilters}>Фільтр</button>

      {showFilters && (
        <div style={{ marginTop: 10 }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              style={{
                marginRight: 5,
                fontWeight: filter === f.value ? 'bold' : 'normal',
              }}
              onClick={() => onFilterChange(f.value)}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {filter !== 'none' && (
        <div style={{ marginTop: 10 }}>
          <label>Інтенсивність: {intensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={e => onIntensityChange(Number(e.target.value))}
          />
        </div>
      )}

      {/* Показуємо активний CSS-фільтр для наочного контролю */}
      <div style={{ marginTop: 10, fontStyle: 'italic' }}>
       {/* Поточний фільтр: {getCssFilter()} */}
      </div>
    </div>
  );
}

export default FilterSelector;

