import React, { useState } from 'react';
import { Search, X, Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import { DOC_ICONS, DOC_TYPES } from '../../../data/seedDocs';
import EmptyState from '../../../components/ui/EmptyState';
import DocModal from './DocModal';
import DeleteModal from './DeleteModal';

function ProjectDocs({ project, onViewCategory, docsData, onAddDoc, onDeleteCategoryDocs }) {
  const categories = Object.entries(project.docs);
  const catNames = categories.map(([c]) => c);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState({ title: "", type: "Documento", author: "", category: catNames[0] || "", url: "" });
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = catNames.filter((cat) => {
    const q = search.toLowerCase();
    if (!q) return true;
    if (cat.toLowerCase().includes(q)) return true;
    return (docsData[cat] || []).some((d) => d.title.toLowerCase().includes(q));
  });

  const openAdd = () => {
    setForm({ title: "", type: "Documento", author: "", category: catNames[0] || "", url: "" });
    setFormError(""); setModalMode("add");
  };

  const openEdit = (cat) => {
    const first = (docsData[cat] || [])[0];
    setForm({ title: first?.title || "", type: first?.type || "Documento", author: first?.author || "", url: first?.url || "", category: cat });
    setFormError(""); setModalMode("edit");
  };

  const closeModal = () => { setModalMode(null); setFormError(""); };

  const handleSave = () => {
    if (!form.title.trim()) { setFormError("O título é obrigatório."); return; }
    if (!form.author.trim()) { setFormError("O autor é obrigatório."); return; }
    onAddDoc(form.category, { ...form, id: Date.now(), date: new Date().toLocaleDateString("pt-BR") });
    closeModal();
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Top bar: busca primeiro, depois botão ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2.5 rounded-lg" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
          <Search size={14} color="#9AA2B1" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categorias ou documentos…" className="flex-1 outline-none text-[13px] bg-transparent" style={{ color: "#14171F" }} />
          {search && <button onClick={() => setSearch("")} style={{ color: "#C2C8D2" }}><X size={13} /></button>}
        </div>
        {search && <span className="text-[12px]" style={{ color: "#9AA2B1" }}>{filtered.length} categoria{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</span>}
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white shrink-0" style={{ background: project.color }} onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.88; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}>
          <Plus size={15} /> Adicionar Documentação
        </button>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="Nenhuma categoria encontrada" description={`Nenhum resultado para "${search}"`} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((cat) => {
            const Icon = DOC_ICONS[cat] || FileText;
            const richDocs = docsData[cat] || [];
            return (
              <div key={cat} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
                <div className="h-24 flex items-center justify-center relative shrink-0" style={{ background: project.soft }}>
                  <Icon size={26} color={project.color} />
                  {/* ── Botões editar e excluir no card ── */}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button onClick={() => openEdit(cat)} title="Editar" className="w-7 h-7 rounded-md flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.85)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}>
                      <Pencil size={13} color={project.color} />
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} title="Excluir" className="w-7 h-7 rounded-md flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.85)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}>
                      <Trash2 size={13} color="#EF4444" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>{cat}</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: project.soft, color: project.color }}>{richDocs.length}</span>
                  </div>
                  {richDocs.length === 0 ? (
                    <p className="text-[12px] mb-3 flex-1" style={{ color: "#9AA2B1" }}>Nenhum documento ainda.</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5 mb-3 flex-1">
                      {richDocs.slice(0, 3).map((d) => <li key={d.id} className="flex items-center gap-2 text-[12px]" style={{ color: "#5B6472" }}><FileText size={11} className="shrink-0" /><span className="truncate">{d.title}</span></li>)}
                      {richDocs.length > 3 && <li className="text-[11.5px]" style={{ color: "#9AA2B1" }}>+{richDocs.length - 3} mais…</li>}
                    </ul>
                  )}
                  <button onClick={() => onViewCategory(cat)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold mt-auto" style={{ color: project.color }}>
                    Ver documentação <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Adicionar / Editar ── */}
      {(modalMode === "add" || modalMode === "edit") && (
        <DocModal project={project} categories={catNames} mode={modalMode} form={form} setForm={setForm} error={formError} onSave={handleSave} onClose={closeModal} catLocked={modalMode === "edit"} />
      )}

      {/* ── Modal Confirmar Exclusão ── */}
      {deleteTarget && (
        <DeleteModal project={project} target={deleteTarget} onConfirm={() => { onDeleteCategoryDocs(deleteTarget); setDeleteTarget(null); }} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   SHARED CRUD PRIMITIVES
   ─────────────────────────────────────────────────────────────────────────── */

/* Generic modal shell used by all CRUD tabs */

export default ProjectDocs;
