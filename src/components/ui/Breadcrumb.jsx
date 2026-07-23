import React from 'react';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] flex-wrap text-ink-secondary">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} className="text-ink-faint shrink-0" />}
          {it.onClick ? (
            <button
              type="button"
              onClick={it.onClick}
              className={`hover:underline transition-colors ${
                i === items.length - 1 ? 'text-ink-primary font-medium' : 'text-ink-secondary'
              }`}
            >
              {it.label}
            </button>
          ) : (
            <span className="font-medium text-ink-primary">{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
