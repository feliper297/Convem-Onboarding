import React, { useRef, useState } from 'react';
import { X, Plus, Pencil, Paperclip, Loader2 } from 'lucide-react';
import { DOC_TYPES } from '../../../data/docConstants';

function DocModal({ project, categories, mode, form, setForm, error, onSave, onClose, catLocked, saving }) {
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    e.target.value = '';
  };

  const handleSave = () => {
    onSave({ ...form, file: selectedFile });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-ink-primary/60 z-[99999]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg shadow-elevated overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center border"
              style={{ background: project.soft, borderColor: `${project.color}22` }}
            >
              {mode === 'edit' ? <Pencil size={14} color={project.color} /> : <Plus size={14} color={project.color} />}
            </span>
            <p className="text-sm font-semibold text-ink-primary">
              {mode === 'edit' ? `Editar documentação — ${form.category}` : 'Adicionar documentação'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink-secondary">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {categories && (
            <div className="flex flex-col gap-1.5">
              <label className="field-label">
                Categoria <span className="text-danger">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                disabled={catLocked}
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="field-label">
              Título <span className="text-danger">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Diagrama de arquitetura v2"
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="field-label">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="input"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="field-label">
                Autor <span className="text-danger">*</span>
              </label>
              <input
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Ex: Maria Silva"
                className="input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="field-label">Arquivo (opcional)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-secondary text-xs py-2"
              >
                <Paperclip size={14} />
                {selectedFile ? 'Trocar arquivo' : 'Anexar arquivo'}
              </button>
              {selectedFile && (
                <span className="text-xs text-ink-secondary truncate">{selectedFile.name}</span>
              )}
            </div>
            <p className="text-[11px] text-ink-muted">PDF, imagens ou Office · máx. 10 MB</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.xls,.xlsx,.txt,.md"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="field-label">Link externo (opcional)</label>
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://confluence.empresa.com/..."
              className="input"
            />
            <p className="text-[11px] text-ink-muted">Use arquivo ou link — pelo menos um é recomendado.</p>
          </div>

          {error && <p className="alert-error">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ background: project.color }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {mode === 'edit' ? 'Salvar alterações' : 'Salvar documento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocModal;
