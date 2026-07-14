import React from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import { DOC_TYPES } from '../../../data/seedDocs';

function DocModal({ project, categories, mode, form, setForm, error, onSave, onClose, catLocked }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ background: "rgba(14,17,25,0.70)", zIndex: 99999 }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E4E7EC" }}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: project.soft }}>
              {mode === "edit" ? <Pencil size={14} color={project.color} /> : <Plus size={14} color={project.color} />}
            </span>
            <p className="text-[14px] font-bold" style={{ color: "#14171F" }}>{mode === "edit" ? `Editar documentação — ${form.category}` : "Adicionar Documentação"}</p>
          </div>
          <button onClick={onClose} style={{ color: "#9AA2B1" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {categories && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>Categoria <span style={{ color: "#EF4444" }}>*</span></label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} disabled={catLocked} className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F", background: "#fff" }}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>Título <span style={{ color: "#EF4444" }}>*</span></label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex: Diagrama de arquitetura v2" className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F" }} />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>Tipo</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F", background: "#fff" }}>
                {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>Autor <span style={{ color: "#EF4444" }}>*</span></label>
              <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Ex: Maria Silva" className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F" }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#5B6472" }}>Link (opcional)</label>
            <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://confluence.empresa.com/..." className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none" style={{ border: "1px solid #E4E7EC", color: "#14171F" }} />
          </div>
          {error && <p className="text-[12px] font-medium px-3 py-2 rounded-lg" style={{ background: "#FEF2F2", color: "#EF4444" }}>{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2.5 px-6 py-4" style={{ borderTop: "1px solid #E4E7EC" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#F7F8FA", color: "#5B6472", border: "1px solid #E4E7EC" }}>Cancelar</button>
          <button onClick={onSave} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: project.color }}>{mode === "edit" ? "Salvar Alterações" : "Salvar Documento"}</button>
        </div>
      </div>
    </div>
  );
}

export default DocModal;
