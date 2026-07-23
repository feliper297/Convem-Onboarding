import React from 'react';
import { X, Trash2, Plus, Search, Pencil } from 'lucide-react';

function CrudModal({ project, title, icon: Icon, children, onClose, onSave, saveLabel = 'Salvar' }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-ink-primary/60 z-[99999]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg shadow-elevated overflow-hidden bg-surface max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 sticky top-0 border-b border-border bg-surface">
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center border"
              style={{ background: project.soft, borderColor: `${project.color}22` }}
            >
              <Icon size={14} color={project.color} />
            </span>
            <p className="text-sm font-semibold text-ink-primary">{title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">{children}</div>
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 sticky bottom-0 border-t border-border bg-surface">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="button" onClick={onSave} className="btn-primary" style={{ background: project.color }}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ project, message, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-ink-primary/60 z-[99999]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-elevated overflow-hidden bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md flex items-center justify-center bg-danger-soft">
              <Trash2 size={14} className="text-danger" />
            </span>
            <p className="text-sm font-semibold text-ink-primary">Confirmar exclusão</p>
          </div>
          <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">
          <p className="text-sm text-ink-primary">{message}</p>
          <p className="text-xs text-ink-muted mt-2">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="btn-danger">
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
    </div>
  );
}

function FInput({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`input ${className}`}
    />
  );
}

function FTextarea({ value, onChange, placeholder, rows = 3, maxLength }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="input resize-none"
    />
  );
}

function FSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function CrudToolbar({ project, search, onSearch, onAdd, addLabel, placeholder = 'Buscar…', canEdit = true }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-4">
      <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-md bg-surface border border-border">
        <Search size={14} className="text-ink-muted shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-[13px] bg-transparent text-ink-primary placeholder:text-ink-muted"
        />
        {search && (
          <button type="button" onClick={() => onSearch('')} className="text-ink-faint hover:text-ink-muted">
            <X size={13} />
          </button>
        )}
      </div>
      {canEdit && (
        <button type="button" onClick={onAdd} className="btn-primary shrink-0" style={{ background: project.color }}>
          <Plus size={15} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function RowActions({ project, onEdit, onDelete, canEdit = true }) {
  if (!canEdit) return null;
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={onEdit}
        className="p-1.5 rounded-md text-ink-faint hover:text-brand hover:bg-brand-soft transition-colors"
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 rounded-md text-ink-faint hover:text-danger hover:bg-danger-soft transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function CardActions({ project, onEdit, onDelete, canEdit = true }) {
  if (!canEdit) return null;
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface/90 border border-border hover:bg-surface transition-colors"
      >
        <Pencil size={13} color={project.color} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-7 h-7 rounded-md flex items-center justify-center bg-surface/90 border border-border hover:bg-danger-soft transition-colors"
      >
        <Trash2 size={13} className="text-danger" />
      </button>
    </div>
  );
}

export {
  CrudModal,
  ConfirmDeleteModal,
  Field,
  FInput,
  FTextarea,
  FSelect,
  CrudToolbar,
  RowActions,
  CardActions,
};
