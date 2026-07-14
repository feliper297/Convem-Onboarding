import React from 'react';
import { Loader2 } from 'lucide-react';

function Loading({ label = "Carregando" }) {
  return <div className="flex items-center gap-2 py-10 justify-center text-sm" style={{ color: "#5B6472" }}><Loader2 size={16} className="animate-spin" />{label}…</div>;
}

export default Loading;
