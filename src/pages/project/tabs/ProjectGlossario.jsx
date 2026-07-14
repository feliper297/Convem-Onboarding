import React, { useState } from 'react';
import { BookMarked, Plus, Pencil } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, CrudToolbar, RowActions } from '../../../components/crud';

function ProjectGlossario({ project, pushToast }) {
  const [items, setItems] = useState(() => project.glossario.map((g, i) => ({ ...g, id: i + 1 })));
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { mode, item }
  const [form, setForm] = useState({ term: "", def: "" });
  const [delTarget, setDelTarget] = useState(null);

  const filtered = items.filter((g) => !search || g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ term: "", def: "" }); setModal({ mode: "add" }); };
  const openEdit = (item) => { setForm({ term: item.term, def: item.def }); setModal({ mode: "edit", item }); };
  const save = () => {
    if (!form.term.trim()) return;
    if (modal.mode === "add") {
      setItems((prev) => [...prev, { ...form, id: Date.now() }]);
      pushToast("Termo adicionado!", "success");
    } else {
      setItems((prev) => prev.map((g) => g.id === modal.item.id ? { ...g, ...form } : g));
      pushToast("Termo atualizado!", "success");
    }
    setModal(null);
  };
  const confirmDelete = () => {
    setItems((prev) => prev.filter((g) => g.id !== delTarget.id));
    pushToast("Termo removido.", "default");
    setDelTarget(null);
  };

  return (
    <div className="w-full">
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Termo" placeholder="Buscar termos…" />
      <div className="flex flex-col gap-2.5">
        {filtered.map((g) => (
          <div key={g.id} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
            <span className="text-[12px] font-bold px-2 py-1 rounded-md shrink-0" style={{ background: project.soft, color: project.color, fontFamily: "'JetBrains Mono', monospace" }}>{g.term}</span>
            <p className="text-[12.5px] pt-0.5 flex-1" style={{ color: "#5B6472" }}>{g.def}</p>
            <RowActions project={project} onEdit={() => openEdit(g)} onDelete={() => setDelTarget(g)} />
          </div>
        ))}
        {filtered.length === 0 && <EmptyState icon={BookMarked} title="Nenhum termo encontrado" />}
      </div>
      {modal && (
        <CrudModal project={project} title={modal.mode === "add" ? "Adicionar Termo" : "Editar Termo"} icon={modal.mode === "add" ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === "add" ? "Salvar" : "Salvar Alterações"}>
          <Field label="Termo" required><FInput value={form.term} onChange={(v) => setForm((f) => ({ ...f, term: v }))} placeholder="Ex: PIX" /></Field>
          <Field label="Definição" required><FTextarea value={form.def} onChange={(v) => setForm((f) => ({ ...f, def: v }))} placeholder="Descreva o que este termo significa…" /></Field>
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message={`Deseja excluir o termo "${delTarget.term}"?`} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TIME (PESSOAS)
   ─────────────────────────────────────────────────────────────────────────── */

export default ProjectGlossario;
