import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FInput } from '../crud';

function PasswordInput({ value, onChange, placeholder, className = '' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
      />
      <FInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={visible ? 'text' : 'password'}
        className={`pl-9 pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-ink-muted hover:text-ink-secondary transition-colors"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default PasswordInput;
