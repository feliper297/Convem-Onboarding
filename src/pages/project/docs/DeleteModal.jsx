import React from 'react';
import { X, Trash2 } from 'lucide-react';

function DeleteModal({ project, target, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ background: "rgba(14,17,25,0.70)", zIndex: 99999 }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E4E7EC" }}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FEF2F2" }}><Trash2 size={14} color="#EF4444" /></span>
            <p className="text-[14px] font-bold" style={{ color: "#14171F" }}>Confirmar Exclusão</p>
          </div>
          <button onClick={onClose} style={{ color: "#9AA2B1" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-6">
          <p className="text-[14px]" style={{ color: "#14171F" }}>Tem certeza que deseja excluir todos os documentos da categoria <strong>"{target}"</strong>?</p>
          <p className="text-[12.5px] mt-2" style={{ color: "#9AA2B1" }}>Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex items-center justify-end gap-2.5 px-6 py-4" style={{ borderTop: "1px solid #E4E7EC" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#F7F8FA", color: "#5B6472", border: "1px solid #E4E7EC" }}>Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "#EF4444" }}>Sim, excluir</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
