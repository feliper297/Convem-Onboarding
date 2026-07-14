import React, { useState } from 'react';

function Tooltip({ children, label }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span className="absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg z-50" style={{ background: "#344054" }}>{label}</span>}
    </span>
  );
}

export default Tooltip;
