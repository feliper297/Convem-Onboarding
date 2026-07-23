import React, { useState } from 'react';
import { Calendar, Video, Clock, Users, ExternalLink, Plus, Pencil } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, CrudToolbar, CardActions } from '../../../components/crud';
import { createReuniao, updateReuniao, deleteReuniao } from '../../../services/entityService';

function ProjectReunioes({ project, pushToast, onRefresh }) {
  const [items, setItems] = useState(() => project.reunioes || []);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', frequency: '', duration: '', time: '', participants: '', descricao: '', link: '' });
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.descricao.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name: '', frequency: '', duration: '', time: '', participants: '', descricao: '', link: '' }); setModal({ mode: 'add' }); };
  const openEdit = (item) => {
    setForm({
      name: item.name,
      frequency: item.frequency,
      duration: item.duration,
      time: item.time,
      participants: Array.isArray(item.participants) ? item.participants.join(', ') : item.participants,
      descricao: item.descricao,
      link: item.link || '',
    });
    setModal({ mode: 'edit', item });
  };

  const save = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await createReuniao(project.id, form);
        pushToast('Reunião adicionada!', 'success');
      } else {
        await updateReuniao(modal.item.id, form);
        pushToast('Reunião atualizada!', 'success');
      }
      const updated = await onRefresh();
      setItems(updated.reunioes || []);
      setModal(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao salvar reunião.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await deleteReuniao(delTarget.id);
      const updated = await onRefresh();
      setItems(updated.reunioes || []);
      pushToast('Reunião removida.', 'default');
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover reunião.', 'default');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <CrudToolbar project={project} search={search} onSearch={setSearch} onAdd={openAdd} addLabel="Adicionar Reunião" placeholder="Buscar reuniões…" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const parts = Array.isArray(r.participants) ? r.participants.join(', ') : r.participants;
          return (
            <div key={r.id} className="rounded-lg p-5 flex flex-col gap-3 relative" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="absolute top-3 right-3"><CardActions project={project} onEdit={() => openEdit(r)} onDelete={() => setDelTarget(r)} /></div>
              <div className="flex items-center gap-2.5 pr-16">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Video size={16} color={project.color} /></div>
                <p className="text-[14px] font-bold" style={{ color: 'var(--ink-primary)' }}>{r.name}</p>
              </div>
              <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: '#4B5563' }}>{r.descricao}</p>
              <div className="flex flex-col gap-1.5 pt-2" style={{ borderTop: '1px solid #F0F2F5' }}>
                <div className="flex items-center gap-2 text-[12px]" style={{ color: '#4B5563' }}><Calendar size={12} color={project.color} /><span><strong style={{ color: 'var(--ink-primary)' }}>Frequência:</strong> {r.frequency}</span></div>
                <div className="flex items-center gap-2 text-[12px]" style={{ color: '#4B5563' }}><Clock size={12} color={project.color} /><span><strong style={{ color: 'var(--ink-primary)' }}>Horário:</strong> {r.time} · {r.duration}</span></div>
                <div className="flex items-start gap-2 text-[12px]" style={{ color: '#4B5563' }}><Users size={12} color={project.color} className="mt-0.5 shrink-0" /><span><strong style={{ color: 'var(--ink-primary)' }}>Participantes:</strong> {parts}</span></div>
                {r.link && r.link !== '#' ? (
                  <a href={r.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px] font-semibold mt-1" style={{ color: project.color }}>
                    <ExternalLink size={12} /> Entrar na reunião
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11.5px] mt-1" style={{ color: '#C2C8D2' }}>
                    <ExternalLink size={11} /> Sem link configurado
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="col-span-3"><EmptyState icon={Calendar} title="Nenhuma reunião encontrada" /></div>}
      </div>
      {modal && (
        <CrudModal project={project} title={modal.mode === 'add' ? 'Adicionar Reunião' : 'Editar Reunião'} icon={modal.mode === 'add' ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === 'add' ? 'Salvar' : 'Salvar Alterações'}>
          <Field label="Nome da reunião" required><FInput value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Ex: Sprint Review" /></Field>
          <Field label="Descrição"><FTextarea value={form.descricao} onChange={(v) => setForm((f) => ({ ...f, descricao: v }))} placeholder="Objetivo e pauta desta cerimônia…" rows={2} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Frequência"><FInput value={form.frequency} onChange={(v) => setForm((f) => ({ ...f, frequency: v }))} placeholder="Ex: A cada 2 semanas" /></Field>
            <Field label="Duração"><FInput value={form.duration} onChange={(v) => setForm((f) => ({ ...f, duration: v }))} placeholder="Ex: 1h" /></Field>
            <Field label="Horário"><FInput value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} placeholder="Ex: 09:00 (seg)" /></Field>
            <Field label="Participantes"><FInput value={form.participants} onChange={(v) => setForm((f) => ({ ...f, participants: v }))} placeholder="Ex: Devs, PO, QA" /></Field>
          </div>
          <Field label="Link (opcional)"><FInput value={form.link} onChange={(v) => setForm((f) => ({ ...f, link: v }))} placeholder="https://meet.google.com/…" /></Field>
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message={`Deseja excluir a reunião "${delTarget.name}"?`} onConfirm={confirmDelete} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

export default ProjectReunioes;
