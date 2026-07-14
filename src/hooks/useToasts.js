import { useState, useCallback } from 'react';

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, tone = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

export default useToasts;
