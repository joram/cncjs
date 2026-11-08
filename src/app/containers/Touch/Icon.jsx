import PropTypes from 'prop-types';
import React from 'react';

// Stroke paths drawn on a 24x24 grid
const strokes = {
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up-left': 'M17 17L7 7M7 15V7h8',
  'arrow-up-right': 'M7 17L17 7M9 7h8v8',
  'arrow-down-left': 'M17 7L7 17M7 9v8h8',
  'arrow-down-right': 'M7 7l10 10M17 9v8H9',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'pause': 'M9 5v14M15 5v14',
  'reset': 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5',
  'home': 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  'probe': 'M12 3v12M8 11l4 4 4-4M4 20h16',
  'jog': 'M12 2v20M2 12h20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3',
  'job': 'M6 3h8l4 4v14H6zM10 11v6l5-3z',
  'target': 'M12 1v4M12 19v4M1 12h4M19 12h4M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6'
};

// Solid shapes
const fills = {
  'play': 'M7 4.5v15l12.5-7.5z',
  'stop': 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'
};

const Icon = ({ name, size = 24 }) => {
  const fill = fills[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={fill || strokes[name]} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Icon;
