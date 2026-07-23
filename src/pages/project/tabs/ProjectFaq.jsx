import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Plus, Pencil } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, CrudToolbar, RowActions } from '../../../components/crud';
import { createFaqItem, updateFaqItem, deleteFaqItem } from '../../../services/entityService';

function ProjectFaq({ project, pushToast, onRefresh }) {
  const initItems = () => {
    return Object.entries(project.faq || {}).flatMap(([cat, qs]) => qs.map((q) => ({ ...q, cat })));
  };
  const [items, setItems] = useState(initItems);
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ q: '', a: '', cat: '' });
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const cats = [...new Set(items.map((i) => i.cat))];
  const filtered = items.filter((i) => !search || i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()) || i.cat.toLowerCase().includes(search.toLowerCase()));
  const grouped = cats.map((cat) => ({ cat, items: filtered.filter((i) => i.cat === cat) })).filter((g) => g.items.length > 0);

  const openAdd = () => { setForm({ q: '', a: '', cat: cats[0] || '' }); setModal({ mode: 'add' }); };
  const openEdit = (item) => { setForm({ q: item.q, a: item.a, cat: item.cat }); setModal({ mode: 'edit', item }); };

  const reloadItems = (updated) => {
    const flat = Object.entries(updated.faq || {}).flatMap(([cat, qs]) => qs.map((q) => ({ ...q, cat })));
    setItems(flat);
  };

  const save = async () => {
    if (!form.q.trim() || !form.a.trim() || saving) return;
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await createFaqItem(project.id, form);
        pushToast('Pergunta adicionada!', 'success');
      } else {
        await updateFaqItem(modal.item.id, form);
        pushToast('Pergunta atualizada!', 'success');
      }
      const updated = await onRefresh();
      reloadItems(updated);
      setModal(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao salvar pergunta.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await deleteFaqItem(delTarget.id);
      const updated = await onRefresh();
      reloadItems(updated);
      pushToast('Pergunta removida.', 'default');
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover pergunta.', 'default');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Pergunta" placeholder="Buscar perguntas…" />
      {grouped.length === 0 && <EmptyState icon={HelpCircle} title="Nenhuma pergunta encontrada" />}
      {grouped.map(({ cat, items: catItems }) => (
        <div key={cat} className="mb-6">
          <h3 className="text-[12.5px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: '#9CA3AF' }}>{cat}</h3>
          <div className="flex flex-col gap-2">
            {catItems.map((it) => {
              const open = openIdx === it.id;
              return (
                <div key={it.id} className="rounded-xl bg-surface border border-border">
                  <div className="flex items-start gap-2 justify-between px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : it.id)}
                      className="flex items-start gap-2 text-left flex-1 min-w-0"
                    >
                      <span className="text-[13px] font-semibold text-ink-primary break-words min-w-0 flex-1">{it.q}</span>
                      <ChevronDown size={15} className={`transition-transform shrink-0 mt-0.5 ${open ? 'rotate-180' : ''}`} color="#9CA3AF" />
                    </button>
                    <div className="shrink-0">
                      <RowActions project={project} onEdit={() => openEdit(it)} onDelete={() => setDelTarget(it)} />
                    </div>
                  </div>
                  {open && (
                    <div className="px-4 pb-3.5 text-[12.5px] text-ink-secondary break-words whitespace-pre-wrap leading-relaxed">{it.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {modal && (
        <CrudModal project={project} title={modal.mode === 'add' ? 'Adicionar Pergunta' : 'Editar Pergunta'} icon={modal.mode === 'add' ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === 'add' ? 'Salvar' : 'Salvar Alterações'}>
          <Field label="Categoria"><FInput value={form.cat} onChange={(v) => setForm((f) => ({ ...f, cat: v }))} placeholder="Ex: Acesso, Ambiente…" /></Field>
          <Field label="Pergunta" required><FInput value={form.q} onChange={(v) => setForm((f) => ({ ...f, q: v }))} placeholder="Ex: Como solicito acesso ao repositório?" /></Field>
          <Field label="Resposta" required><FTextarea value={form.a} onChange={(v) => setForm((f) => ({ ...f, a: v }))} placeholder="Descreva a resposta de forma clara…" rows={4} /></Field>
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message={`Deseja excluir a pergunta "${delTarget.q.substring(0, 60)}…"?`} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

export default ProjectFaq;
