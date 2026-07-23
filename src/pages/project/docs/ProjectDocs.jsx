import React, { useState } from 'react';
import { Search, X, Plus, FileText, ExternalLink } from 'lucide-react';
import { DOC_ICONS } from '../../../data/docConstants';
import EmptyState from '../../../components/ui/EmptyState';
import DocModal from './DocModal';
import { uploadProjectDocument } from '../../../services/storageService';

function ProjectDocs({ project, onViewCategory, docsData, onAddDoc, canEdit = false }) {
  const categories = Object.entries(project.docs);
  const catNames = categories.map(([c]) => c);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Documento', author: '', category: catNames[0] || '', url: '' });
  const [formError, setFormError] = useState('');

  const filtered = catNames.filter((cat) => {
    const q = search.toLowerCase();
    if (!q) return true;
    if (cat.toLowerCase().includes(q)) return true;
    return (docsData[cat] || []).some((d) => d.title.toLowerCase().includes(q));
  });

  const openAdd = () => {
    setForm({ title: '', type: 'Documento', author: '', category: catNames[0] || '', url: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError('');
    setSaving(false);
  };

  const handleSave = async (payload) => {
    if (!payload.title.trim()) {
      setFormError('O título é obrigatório.');
      return;
    }
    if (!payload.author.trim()) {
      setFormError('O autor é obrigatório.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      let url = payload.url?.trim() || '';
      if (payload.file) {
        url = await uploadProjectDocument(project.id, payload.file);
      }
      await onAddDoc(payload.category, {
        title: payload.title,
        type: payload.type,
        author: payload.author,
        url,
      });
      closeModal();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Erro ao salvar documento.');
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Top bar: busca primeiro, depois botão ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2.5 rounded-lg" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
          <Search size={14} color="#9CA3AF" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categorias ou documentos…" className="flex-1 outline-none text-[13px] bg-transparent" style={{ color: "var(--ink-primary)" }} />
          {search && <button onClick={() => setSearch("")} style={{ color: "#C2C8D2" }}><X size={13} /></button>}
        </div>
        {search && <span className="text-[12px]" style={{ color: "#9CA3AF" }}>{filtered.length} categoria{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</span>}
        {canEdit && (
          <button type="button" onClick={openAdd} className="btn-primary shrink-0" style={{ background: project.color }}>
            <Plus size={15} /> Adicionar Documentação
          </button>
        )}
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
              <div key={cat} className="rounded-lg overflow-hidden flex flex-col" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
                <div className="h-24 flex items-center justify-center relative shrink-0" style={{ background: project.soft }}>
                  <Icon size={26} color={project.color} />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13.5px] font-semibold" style={{ color: "var(--ink-primary)" }}>{cat}</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: project.soft, color: project.color }}>{richDocs.length}</span>
                  </div>
                  {richDocs.length === 0 ? (
                    <p className="text-[12px] mb-3 flex-1" style={{ color: "#9CA3AF" }}>Nenhum documento ainda.</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5 mb-3 flex-1">
                      {richDocs.slice(0, 3).map((d) => <li key={d.id} className="flex items-center gap-2 text-[12px]" style={{ color: "#4B5563" }}><FileText size={11} className="shrink-0" /><span className="truncate">{d.title}</span></li>)}
                      {richDocs.length > 3 && <li className="text-[11.5px]" style={{ color: "#9CA3AF" }}>+{richDocs.length - 3} mais…</li>}
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
      {showModal && (
        <DocModal
          project={project}
          categories={catNames}
          mode="add"
          form={form}
          setForm={setForm}
          error={formError}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   SHARED CRUD PRIMITIVES
   ─────────────────────────────────────────────────────────────────────────── */

/* Generic modal shell used by all CRUD tabs */

export default ProjectDocs;
