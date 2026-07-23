import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

function DeleteProjectModal({ project, onConfirm, onClose, deleting }) {
  const [confirmText, setConfirmText] = useState('');
  const canConfirm = confirmText === project.name && !deleting;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(14,17,25,0.70)', zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-2xl overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50">
              <Trash2 size={14} color="#DC2626" />
            </span>
            <p className="text-[14px] font-bold text-ink-primary">Excluir projeto</p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-muted" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50">
            <AlertTriangle size={16} color="#DC2626" className="shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-red-800">
              Esta ação é permanente e remove todo o conteúdo do projeto (trilha, documentação,
              glossário, reuniões e FAQ). Não pode ser desfeita.
            </p>
          </div>
          <p className="text-[13px] text-ink-primary">
            Para confirmar, digite <strong>{project.name}</strong> abaixo:
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={project.name}
            className="w-full px-3 py-2.5 rounded-md text-[13px] outline-none border border-border text-ink-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="px-4 py-2 rounded-md text-[13px] font-semibold text-white bg-red-600 disabled:opacity-50"
          >
            {deleting ? 'Excluindo…' : 'Excluir definitivamente'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProjectModal;
