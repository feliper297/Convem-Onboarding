import React from 'react';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] flex-wrap" style={{ color: "#5B6472" }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} style={{ color: "#C2C8D2" }} />}
          {it.onClick ? (
            <button onClick={it.onClick} className="hover:underline transition-colors" style={{ color: i === items.length - 1 ? "#14171F" : "#5B6472", fontWeight: i === items.length - 1 ? 600 : 500 }}>{it.label}</button>
          ) : (
            <span style={{ fontWeight: 600, color: "#14171F" }}>{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
