import Toolpath from 'gcode-toolpath';

const ARC_DIVISIONS = 30;

const emptyBounds = () => ({
  min: { x: Infinity, y: Infinity, z: Infinity },
  max: { x: -Infinity, y: -Infinity, z: -Infinity }
});

// Flattens a G-code program into XY line segments for a top-down preview.
// Returns flat [x1, y1, x2, y2, ...] arrays for feed and rapid moves, the
// bounding box of the cutting moves, and the program's units.
export const parseToolpath = (gcode) => {
  const feeds = [];
  const rapids = [];
  const bounds = emptyBounds();
  let units = 'G21';

  const extend = (v) => {
    bounds.min.x = Math.min(bounds.min.x, v.x);
    bounds.min.y = Math.min(bounds.min.y, v.y);
    bounds.min.z = Math.min(bounds.min.z, v.z);
    bounds.max.x = Math.max(bounds.max.x, v.x);
    bounds.max.y = Math.max(bounds.max.y, v.y);
    bounds.max.z = Math.max(bounds.max.z, v.z);
  };

  const toolpath = new Toolpath({
    addLine: (modal, v1, v2) => {
      units = modal.units;
      if (modal.motion === 'G0') {
        rapids.push(v1.x, v1.y, v2.x, v2.y);
        return;
      }
      feeds.push(v1.x, v1.y, v2.x, v2.y);
      extend(v1);
      extend(v2);
    },
    addArcCurve: (modal, v1, v2, v0) => {
      units = modal.units;
      extend(v1);
      extend(v2);

      if (modal.plane !== 'G17') {
        // Arcs outside the XY plane project to a straight line from above
        feeds.push(v1.x, v1.y, v2.x, v2.y);
        return;
      }

      const radius = Math.hypot(v1.x - v0.x, v1.y - v0.y);
      const startAngle = Math.atan2(v1.y - v0.y, v1.x - v0.x);
      let endAngle = Math.atan2(v2.y - v0.y, v2.x - v0.x);
      if (modal.motion === 'G2' && endAngle >= startAngle) {
        endAngle -= 2 * Math.PI;
      }
      if (modal.motion === 'G3' && endAngle <= startAngle) {
        endAngle += 2 * Math.PI;
      }

      let px = v1.x;
      let py = v1.y;
      for (let i = 1; i <= ARC_DIVISIONS; ++i) {
        const angle = startAngle + (endAngle - startAngle) * (i / ARC_DIVISIONS);
        const x = v0.x + radius * Math.cos(angle);
        const y = v0.y + radius * Math.sin(angle);
        feeds.push(px, py, x, y);
        bounds.min.x = Math.min(bounds.min.x, x);
        bounds.min.y = Math.min(bounds.min.y, y);
        bounds.max.x = Math.max(bounds.max.x, x);
        bounds.max.y = Math.max(bounds.max.y, y);
        px = x;
        py = y;
      }
    }
  });

  toolpath.loadFromStringSync(gcode);

  const hasCuts = feeds.length > 0;
  return {
    feeds,
    rapids,
    bounds: hasCuts ? bounds : null,
    units: (units === 'G20') ? 'in' : 'mm'
  };
};
