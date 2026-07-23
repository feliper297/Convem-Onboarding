import React from 'react';
import { Loader2 } from 'lucide-react';

function Loading({ label = 'Carregando' }) {
  return (
    <div className="flex items-center gap-2 py-10 justify-center text-sm text-ink-secondary">
      <Loader2 size={16} className="animate-spin text-brand" />
      {label}…
    </div>
  );
}

export default Loading;
