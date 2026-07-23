import React from 'react';

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="card-padded flex items-center gap-3">
      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-surface-muted border border-border">
        <Icon size={17} className="text-ink-secondary" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="kpi-value">{value}</p>
        <p className="kpi-label">{label}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
