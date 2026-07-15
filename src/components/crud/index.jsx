import React from 'react';
import { X, Trash2, Plus, Search, Pencil } from 'lucide-react';

function CrudModal({ project, title, icon: Icon, children, onClose, onSave, saveLabel = "Salvar" }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ background: "rgba(14,17,25,0.70)", zIndex: 99999 }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: "1px solid #E4E7EC", background: "#fff" }}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: project.soft }}>
              <Icon size={14} color={project.color} />
            </span>
            <p className="text-[14px] font-bold" style={{ color: "#14171F" }}>{title}</p>
          </div>
          <button onClick={onClose} style={{ color: "#9AA2B1" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 sticky bottom-0" style={{ borderTop: "1px solid #E4E7EC", background: "#fff" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#F7F8FA", color: "#5B6472", border: "1px solid #E4E7EC" }}>Cancelar</button>
          <button onClick={onSave} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: project.color }}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ project, message, onConfirm, onClose }) {
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
          <p className="text-[14px]" style={{ color: "#14171F" }}>{message}</p>
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

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>
      {children}
    </div>
  );
}

function FInput({ value, onChange, placeholder, type = "text", className = "" }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-3 py-2.5 rounded-lg text-[13px] outline-none ${className}`} style={{ border: "1px solid #E4E7EC", color: "#14171F" }} />;
}

function FTextarea({ value, onChange, placeholder, rows = 3, maxLength }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} maxLength={maxLength} className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none" style={{ border: "1px solid #E4E7EC", color: "#14171F" }} />;
}

function FSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F", background: "#fff" }}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

/* Toolbar: search + add button */
function CrudToolbar({ project, search, onSearch, onAdd, addLabel, placeholder = "Buscar…" }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2.5 rounded-lg" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
        <Search size={14} color="#9AA2B1" />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} className="flex-1 outline-none text-[13px] bg-transparent" style={{ color: "#14171F" }} />
        {search && <button onClick={() => onSearch("")} style={{ color: "#C2C8D2" }}><X size={13} /></button>}
      </div>
      <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white shrink-0" style={{ background: project.color }} onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.88; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}>
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}

/* Row action buttons used in tables */
function RowActions({ project, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onEdit} className="p-1.5 rounded-lg transition-colors" style={{ color: "#C2C8D2" }} onMouseEnter={(e) => { e.currentTarget.style.color = project.color; e.currentTarget.style.background = project.soft; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#C2C8D2"; e.currentTarget.style.background = "transparent"; }}><Pencil size={14} /></button>
      <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors" style={{ color: "#C2C8D2" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#C2C8D2"; e.currentTarget.style.background = "transparent"; }}><Trash2 size={14} /></button>
    </div>
  );
}

/* Card action buttons used in card grids */
function CardActions({ project, onEdit, onDelete }) {
  return (
    <div className="flex gap-1.5">
      <button onClick={onEdit} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.85)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}><Pencil size={13} color={project.color} /></button>
      <button onClick={onDelete} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.85)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}><Trash2 size={13} color="#EF4444" /></button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GLOSSÁRIO
   ─────────────────────────────────────────────────────────────────────────── */

export {
  CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, FSelect,
  CrudToolbar, RowActions, CardActions
};
