import React from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-lg border border-dashed border-border bg-surface">
      <div className="w-10 h-10 rounded-md flex items-center justify-center mb-3 bg-surface border border-border">
        <Icon size={18} className="text-ink-muted" />
      </div>
      <p className="font-medium text-sm text-ink-primary">{title}</p>
      {description && (
        <p className="text-sm text-ink-secondary mt-1 max-w-sm">{description}</p>
      )}
    </div>
  );
}

export default EmptyState;
