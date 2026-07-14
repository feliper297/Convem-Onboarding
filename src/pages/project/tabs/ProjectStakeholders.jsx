import React, { useState } from 'react';
import { Network, Plus, Pencil, Mail } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, FSelect, CrudToolbar, RowActions } from '../../../components/crud';

function ProjectStakeholders({ project, pushToast }) {
  const [items, setItems] = useState(() => project.stakeholders.map((s, i) => ({ ...s, id: i + 1 })));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", area: "", contact: "", influence: "Alto", interest: "Alto", expectativa: "" });
  const [delTarget, setDelTarget] = useState(null);

  const filtered = items.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));

  const levelOpts = ["Alto", "Médio", "Baixo"];
  const infColor = (v) => v === "Alto" ? "#0E7C66" : v === "Médio" ? "#B45309" : "#9AA2B1";
  const infBg = (v) => v === "Alto" ? "#E6F4F1" : v === "Médio" ? "#FDF1E3" : "#F7F8FA";

  const openAdd = () => { setForm({ name: "", role: "", area: "", contact: "", influence: "Alto", interest: "Alto", expectativa: "" }); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ name: item.name, role: item.role, area: item.area, contact: item.contact, influence: item.influence, interest: item.interest, expectativa: item.expectativa }); setModal({ mode: "edit", item }); };
  const save = () => {
    if (!form.name.trim()) return;
    if (modal.mode === "add") { setItems((prev) => [...prev, { ...form, id: Date.now() }]); pushToast("Stakeholder adicionado!", "success"); }
    else { setItems((prev) => prev.map((s) => s.id === modal.item.id ? { ...s, ...form } : s)); pushToast("Stakeholder atualizado!", "success"); }
    setModal(null);
  };
  const confirmDelete = () => { setItems((prev) => prev.filter((s) => s.id !== delTarget.id)); pushToast("Stakeholder removido.", "default"); setDelTarget(null); };

  return (
    <div>
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Stakeholder" placeholder="Buscar stakeholders…" />
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E7EC" }}>
        {filtered.length === 0 ? <EmptyState icon={Network} title="Nenhum stakeholder encontrado" /> : (
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E4E7EC" }}>
                {["Stakeholder", "Área", "Influência", "Interesse", "Expectativa", "Contato", ""].map((h) => (
                  <th key={h} className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: "#9AA2B1" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderTop: i === 0 ? "none" : "1px solid #E4E7EC" }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: project.color }}>{s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                      <div><p className="text-[13px] font-semibold" style={{ color: "#14171F" }}>{s.name}</p><p className="text-[11.5px]" style={{ color: "#5B6472" }}>{s.role}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px]" style={{ color: "#5B6472" }}>{s.area}</td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: infBg(s.influence), color: infColor(s.influence) }}>{s.influence}</span></td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: infBg(s.interest), color: infColor(s.interest) }}>{s.interest}</span></td>
                  <td className="px-4 py-3.5 text-[12.5px] max-w-[200px]" style={{ color: "#5B6472" }}>{s.expectativa}</td>
                  <td className="px-4 py-3.5"><a href={`mailto:${s.contact}`} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: project.color }}><Mail size={12} /> Contato</a></td>
                  <td className="px-4 py-3.5"><RowActions project={project} onEdit={() => openEdit(s)} onDelete={() => setDelTarget(s)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <CrudModal project={project} title={modal.mode === "add" ? "Adicionar Stakeholder" : "Editar Stakeholder"} icon={modal.mode === "add" ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === "add" ? "Salvar" : "Salvar Alterações"}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome completo" required><FInput value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Ex: Fernanda Lima" /></Field>
            <Field label="Cargo" required><FInput value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} placeholder="Ex: Head de Produto" /></Field>
            <Field label="Área"><FInput value={form.area} onChange={(v) => setForm((f) => ({ ...f, area: v }))} placeholder="Ex: Produto" /></Field>
            <Field label="E-mail"><FInput value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} placeholder="Ex: fernanda@empresa.com" /></Field>
            <Field label="Influência"><FSelect value={form.influence} onChange={(v) => setForm((f) => ({ ...f, influence: v }))} options={levelOpts} /></Field>
            <Field label="Interesse"><FSelect value={form.interest} onChange={(v) => setForm((f) => ({ ...f, interest: v }))} options={levelOpts} /></Field>
          </div>
          <Field label="Expectativa"><FTextarea value={form.expectativa} onChange={(v) => setForm((f) => ({ ...f, expectativa: v }))} placeholder="O que este stakeholder espera do projeto?" rows={2} /></Field>
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message={`Deseja remover ${delTarget.name} dos stakeholders?`} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REUNIÕES
   ─────────────────────────────────────────────────────────────────────────── */

export default ProjectStakeholders;
