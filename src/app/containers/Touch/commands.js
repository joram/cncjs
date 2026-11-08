// G-code built by the touch view. Grbl's `$J=` jog command carries its own
// distance mode and units, so jogging never changes the modal state that a
// loaded program relies on.

const mapWCSToP = (wcs) => ({
  'G54': 1,
  'G55': 2,
  'G56': 3,
  'G57': 4,
  'G58': 5,
  'G59': 6
}[wcs] || 1);

const words = (axes) => Object.keys(axes)
  .map(axis => `${axis.toUpperCase()}${axes[axis]}`)
  .join(' ');

// Jog by a relative distance in millimeters, e.g. { x: 1, y: -1 }
export const jogBy = (axes, feedrate) => `$J=G91 G21 ${words(axes)} F${feedrate}`;

// Jog to a work position in millimeters, e.g. { x: 0, y: 0 }
export const jogTo = (axes, feedrate) => `$J=G90 G21 ${words(axes)} F${feedrate}`;

// Set the current position of the given axes to zero in the active work coordinate system
export const zeroAxes = (wcs, axes) => `G10 L20 P${mapWCSToP(wcs)} ${axes.map(axis => `${axis.toUpperCase()}0`).join(' ')}`;

// Probe Z against a touch plate and set the top of the workpiece as Z0, as the
// Probe widget does when "Apply tool length offset" is off.
export const probeZ = ({ wcs, probeCommand, probeDepth, probeFeedrate, touchPlateHeight, retractionDistance }) => {
  const towardWorkpiece = (probeCommand === 'G38.2' || probeCommand === 'G38.3');
  return [
    'G91',
    `${probeCommand} Z${towardWorkpiece ? -probeDepth : probeDepth} F${probeFeedrate}`,
    'G90',
    `G10 L20 P${mapWCSToP(wcs)} Z${touchPlateHeight}`,
    'G91',
    `G0 Z${retractionDistance}`,
    'G90'
  ];
};
