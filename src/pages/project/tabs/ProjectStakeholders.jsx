import React, { useState } from 'react';
import { Network, Plus, Pencil, Mail } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, FSelect, CrudToolbar, RowActions } from '../../../components/crud';
import { createStakeholder, updateStakeholder, deleteStakeholder } from '../../../services/entityService';

function ProjectStakeholders({ project, pushToast, onRefresh, canEdit = false }) {
  const [items, setItems] = useState(() => project.stakeholders || []);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', area: '', contact: '', influence: 'Alto', interest: 'Alto', expectativa: '' });
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));

  const levelOpts = ['Alto', 'Médio', 'Baixo'];
  const infColor = (v) => v === 'Alto' ? '#0B6B58' : v === 'Médio' ? '#B45309' : '#9CA3AF';
  const infBg = (v) => v === 'Alto' ? '#E8F3F0' : v === 'Médio' ? '#FDF1E3' : '#F3F4F6';

  const openAdd = () => { setForm({ name: '', role: '', area: '', contact: '', influence: 'Alto', interest: 'Alto', expectativa: '' }); setModal({ mode: 'add' }); };
  const openEdit = (item) => { setForm({ name: item.name, role: item.role, area: item.area, contact: item.contact, influence: item.influence, interest: item.interest, expectativa: item.expectativa }); setModal({ mode: 'edit', item }); };

  const save = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await createStakeholder(project.id, form);
        pushToast('Stakeholder adicionado!', 'success');
      } else {
        await updateStakeholder(modal.item.id, form);
        pushToast('Stakeholder atualizado!', 'success');
      }
      const updated = await onRefresh();
      setItems(updated.stakeholders || []);
      setModal(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao salvar stakeholder.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await deleteStakeholder(delTarget.id);
      const updated = await onRefresh();
      setItems(updated.stakeholders || []);
      pushToast('Stakeholder removido.', 'default');
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover stakeholder.', 'default');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Stakeholder" placeholder="Buscar stakeholders…" canEdit={canEdit} />
      <div className="table-shell">
        {filtered.length === 0 ? <EmptyState icon={Network} title="Nenhum stakeholder encontrado" /> : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-subtle border-b border-border">
                {['Stakeholder', 'Área', 'Influência', 'Interesse', 'Expectativa', 'Contato', ''].map((h) => (
                  <th key={h} className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3 text-ink-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB' }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: project.color }}>{s.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                      <div><p className="text-[13px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{s.name}</p><p className="text-[11.5px]" style={{ color: '#4B5563' }}>{s.role}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px]" style={{ color: '#4B5563' }}>{s.area}</td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: infBg(s.influence), color: infColor(s.influence) }}>{s.influence}</span></td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: infBg(s.interest), color: infColor(s.interest) }}>{s.interest}</span></td>
                  <td className="px-4 py-3.5 text-[12.5px] max-w-[200px]" style={{ color: '#4B5563' }}>{s.expectativa}</td>
                  <td className="px-4 py-3.5">
                    {s.contact ? (
                      <a href={`mailto:${s.contact}`} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: project.color }}><Mail size={12} /> Contato</a>
                    ) : <span style={{ color: '#C2C8D2' }}>—</span>}
                  </td>
                  <td className="px-4 py-3.5"><RowActions project={project} onEdit={() => openEdit(s)} onDelete={() => setDelTarget(s)} canEdit={canEdit} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <CrudModal project={project} title={modal.mode === 'add' ? 'Adicionar Stakeholder' : 'Editar Stakeholder'} icon={modal.mode === 'add' ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === 'add' ? 'Salvar' : 'Salvar Alterações'}>
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

export default ProjectStakeholders;
