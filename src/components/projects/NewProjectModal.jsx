import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Field, FInput, FTextarea } from '../crud';
import { PROJECT_COLORS, PROJECT_ICONS } from '../../data/projectDefaults';

const BRAND = { color: "#0E7C66", soft: "#E6F4F1" };

const EMPTY_FORM = {
  name: "",
  description: "",
  techLead: "",
  techLeadEmail: "",
  iconId: PROJECT_ICONS[0].id,
  colorIndex: 0,
};

function NewProjectModal({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return setError("Informe o nome do projeto.");
    if (!form.techLead.trim()) return setError("Informe o Tech Lead responsável.");
    if (form.techLeadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.techLeadEmail)) {
      return setError("Informe um e-mail válido para o Tech Lead.");
    }

    const iconEntry = PROJECT_ICONS.find((i) => i.id === form.iconId) || PROJECT_ICONS[0];
    const colorEntry = PROJECT_COLORS[form.colorIndex] || PROJECT_COLORS[0];

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      techLead: form.techLead.trim(),
      techLeadEmail: form.techLeadEmail.trim(),
      icon: iconEntry.icon,
      color: colorEntry.color,
      soft: colorEntry.soft,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(14,17,25,0.70)", zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0"
          style={{ borderBottom: "1px solid #E4E7EC", background: "#fff" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: BRAND.soft }}
            >
              <Plus size={14} color={BRAND.color} />
            </span>
            <p className="text-[14px] font-bold" style={{ color: "#14171F" }}>Novo Projeto</p>
          </div>
          <button onClick={onClose} style={{ color: "#9AA2B1" }} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <Field label="Nome do projeto" required>
            <FInput
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="Ex: APP Banking"
            />
          </Field>

          <Field label="Descrição completa">
            <FTextarea
              value={form.description}
              onChange={(v) => set("description", v)}
              placeholder="Descreva o propósito e contexto do projeto…"
              rows={3}
              maxLength={200}
            />
          </Field>

          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Responsável" required>
                <FInput
                  value={form.techLead}
                  onChange={(v) => set("techLead", v)}
                  placeholder="Ex: Marina Tassi"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="E-mail do Responsável">
                <FInput
                  value={form.techLeadEmail}
                  onChange={(v) => set("techLeadEmail", v)}
                  placeholder="marina.tassi@empresa.com"
                />
              </Field>
            </div>
          </div>

          <Field label="Ícone">
            <div className="grid grid-cols-5 gap-2">
              {PROJECT_ICONS.map(({ id, icon: Icon, label }) => {
                const selected = form.iconId === id;
                const accent = PROJECT_COLORS[form.colorIndex];
                return (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    onClick={() => set("iconId", id)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg transition-colors"
                    style={{
                      background: selected ? accent.soft : "#F7F8FA",
                      border: selected ? `2px solid ${accent.color}` : "2px solid #E4E7EC",
                    }}
                  >
                    <Icon size={18} color={selected ? accent.color : "#5B6472"} />
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Cor do projeto">
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map(({ color, soft, label }, idx) => {
                const selected = form.colorIndex === idx;
                return (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    onClick={() => set("colorIndex", idx)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{
                      background: selected ? soft : "#F7F8FA",
                      color: selected ? color : "#5B6472",
                      border: selected ? `2px solid ${color}` : "2px solid #E4E7EC",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          {error && (
            <p
              className="text-[12px] font-medium px-3 py-2 rounded-lg"
              style={{ background: "#FEF2F2", color: "#EF4444" }}
            >
              {error}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-2.5 px-6 py-4 sticky bottom-0"
          style={{ borderTop: "1px solid #E4E7EC", background: "#fff" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: "#F7F8FA", color: "#5B6472", border: "1px solid #E4E7EC" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: BRAND.color }}
          >
            Criar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewProjectModal;
