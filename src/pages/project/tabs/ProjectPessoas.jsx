import React, { useState } from 'react';
import { Users, Plus, Pencil, Mail } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, CrudToolbar, CardActions } from '../../../components/crud';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '../../../services/entityService';

function ProjectPessoas({ project, pushToast, onRefresh, canEdit = false }) {
  const [items, setItems] = useState(() => project.pessoas || []);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', area: '', contact: '', specialty: '' });
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name: '', role: '', area: '', contact: '', specialty: '' }); setModal({ mode: 'add' }); };
  const openEdit = (item) => { setForm({ name: item.name, role: item.role, area: item.area, contact: item.contact, specialty: item.specialty }); setModal({ mode: 'edit', item }); };

  const save = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await createTeamMember(project.id, form);
        pushToast('Membro adicionado!', 'success');
      } else {
        await updateTeamMember(modal.item.id, form);
        pushToast('Membro atualizado!', 'success');
      }
      const updated = await onRefresh();
      setItems(updated.pessoas || []);
      setModal(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao salvar membro.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await deleteTeamMember(delTarget.id);
      const updated = await onRefresh();
      setItems(updated.pessoas || []);
      pushToast('Membro removido.', 'default');
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover membro.', 'default');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Membro" placeholder="Buscar membros…" canEdit={canEdit} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-lg p-4 flex flex-col items-center text-center gap-2 relative" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
            <div className="absolute top-2 right-2"><CardActions project={project} onEdit={() => openEdit(p)} onDelete={() => setDelTarget(p)} canEdit={canEdit} /></div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold text-white mt-4" style={{ background: project.color }}>{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
            <div><p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{p.name}</p><p className="text-[12px]" style={{ color: '#4B5563' }}>{p.role} · {p.area}</p></div>
            <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: '#F3F4F6', color: '#4B5563' }}>{p.specialty}</span>
            {p.contact && (
              <a href={`mailto:${p.contact}`} className="flex items-center gap-1.5 text-[11.5px] font-medium mt-1" style={{ color: project.color }}><Mail size={12} /> Contatar</a>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-3"><EmptyState icon={Users} title="Nenhum membro encontrado" /></div>}
      </div>
      {modal && (
        <CrudModal project={project} title={modal.mode === 'add' ? 'Adicionar Membro' : 'Editar Membro'} icon={modal.mode === 'add' ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === 'add' ? 'Salvar' : 'Salvar Alterações'}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome completo" required><FInput value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Ex: Ana Silva" /></Field>
            <Field label="Cargo" required><FInput value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} placeholder="Ex: Tech Lead" /></Field>
            <Field label="Área"><FInput value={form.area} onChange={(v) => setForm((f) => ({ ...f, area: v }))} placeholder="Ex: Engenharia" /></Field>
            <Field label="E-mail"><FInput value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} placeholder="Ex: ana@empresa.com" /></Field>
          </div>
          <Field label="Especialidade"><FInput value={form.specialty} onChange={(v) => setForm((f) => ({ ...f, specialty: v }))} placeholder="Ex: Arquitetura mobile" /></Field>
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message={`Deseja remover ${delTarget.name} do time?`} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

export default ProjectPessoas;
