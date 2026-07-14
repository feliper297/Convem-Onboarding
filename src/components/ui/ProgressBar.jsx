import React from 'react';

function ProgressBar({ value, color = "#0E7C66", track = "#EEF0F3", height = 6 }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: track, height }}>
      <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export default ProgressBar;
