import React from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed" style={{ borderColor: "#E4E7EC" }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "#F7F8FA" }}><Icon size={20} color="#9AA2B1" /></div>
      <p className="font-semibold text-[15px]" style={{ color: "#14171F" }}>{title}</p>
      {description && <p className="text-sm mt-1 max-w-sm" style={{ color: "#5B6472" }}>{description}</p>}
    </div>
  );
}

export default EmptyState;
