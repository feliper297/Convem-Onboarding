import React from 'react';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-[13px] text-ink-secondary">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} className="shrink-0 text-ink-faint" />}
          {it.onClick ? (
            <button
              type="button"
              onClick={it.onClick}
              className={`max-w-[28vw] truncate transition-colors hover:underline sm:max-w-none ${
                i === items.length - 1 ? 'font-medium text-ink-primary' : 'text-ink-secondary'
              }`}
            >
              {it.label}
            </button>
          ) : (
            <span className="max-w-[40vw] truncate font-medium text-ink-primary sm:max-w-none">
              {it.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
