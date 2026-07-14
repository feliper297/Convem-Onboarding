import React from 'react';
import { CheckCircle2 } from 'lucide-react';

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg text-sm font-medium" style={{ background: t.tone === "success" ? "#0E7C66" : "#2754C5", color: "#fff" }}>
          {t.tone === "success" && <CheckCircle2 size={16} />}{t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
