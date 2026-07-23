import React, { useState } from 'react';
import { AlertCircle, Stethoscope, PhoneCall, Terminal, MessageSquare, Plus, Pencil } from 'lucide-react';
import EmptyState from '../../../components/ui/EmptyState';
import { CrudModal, ConfirmDeleteModal, Field, FInput, FTextarea, FSelect, RowActions } from '../../../components/crud';
import {
  createOperacaoAlerta, updateOperacaoAlerta, deleteOperacaoAlerta,
  createOperacaoDiag, updateOperacaoDiag, deleteOperacaoDiag,
  createOperacaoContato, updateOperacaoContato, deleteOperacaoContato,
  createOperacaoLog, updateOperacaoLog, deleteOperacaoLog,
  createOperacaoCanal, updateOperacaoCanal, deleteOperacaoCanal,
} from '../../../services/entityService';

function ProjectOperacao({ project, pushToast, onRefresh }) {
  const op = project.operacao || { alertas: [], diagnostico: [], contatos: [], logs: [], canais: [] };
  const [alertas, setAlertas] = useState(() => op.alertas || []);
  const [diag, setDiag] = useState(() => op.diagnostico || []);
  const [contatos, setContatos] = useState(() => op.contatos || []);
  const [logs, setLogs] = useState(() => op.logs || []);
  const [canais, setCanais] = useState(() => op.canais || []);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [delTarget, setDelTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const sevColor = (s) => s === 'Alta' ? '#EF4444' : s === 'Média' ? '#B45309' : '#4B5563';
  const sevBg = (s) => s === 'Alta' ? '#FEF2F2' : s === 'Média' ? '#FDF1E3' : '#F3F4F6';

  const reloadAll = (updated) => {
    const o = updated.operacao || {};
    setAlertas(o.alertas || []);
    setDiag(o.diagnostico || []);
    setContatos(o.contatos || []);
    setLogs(o.logs || []);
    setCanais(o.canais || []);
  };

  const openModal = (type, mode, item = null) => {
    const defaults = {
      alerta: { nome: '', severidade: 'Alta', significado: '', acao: '' },
      diag: { text: '' },
      contato: { problema: '', responsavel: '', canal: '' },
      log: { sistema: '', onde: '', filtro: '' },
      canal: { nome: '', plataforma: 'Slack', descricao: '' },
    };
    setForm(item ? { ...item } : { ...defaults[type] });
    setModal({ type, mode, item });
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { type, mode, item } = modal;
      if (type === 'alerta') {
        if (mode === 'add') await createOperacaoAlerta(project.id, form);
        else await updateOperacaoAlerta(item.id, form);
      } else if (type === 'diag') {
        if (mode === 'add') await createOperacaoDiag(project.id, form.text, diag.length);
        else await updateOperacaoDiag(item.id, form.text);
      } else if (type === 'contato') {
        if (mode === 'add') await createOperacaoContato(project.id, form, contatos.length);
        else await updateOperacaoContato(item.id, form);
      } else if (type === 'log') {
        if (mode === 'add') await createOperacaoLog(project.id, form, logs.length);
        else await updateOperacaoLog(item.id, form);
      } else if (type === 'canal') {
        if (mode === 'add') await createOperacaoCanal(project.id, form, canais.length);
        else await updateOperacaoCanal(item.id, form);
      }
      const updated = await onRefresh();
      reloadAll(updated);
      pushToast(mode === 'add' ? 'Item adicionado!' : 'Item atualizado!', 'success');
      setModal(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao salvar item.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { type, item } = delTarget;
      const deleters = {
        alerta: deleteOperacaoAlerta,
        diag: deleteOperacaoDiag,
        contato: deleteOperacaoContato,
        log: deleteOperacaoLog,
        canal: deleteOperacaoCanal,
      };
      await deleters[type](item.id);
      const updated = await onRefresh();
      reloadAll(updated);
      pushToast('Item removido.', 'default');
      setDelTarget(null);
    } catch (err) {
      console.error(err);
      pushToast('Erro ao remover item.', 'default');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon: Icon, title, onAdd, addLabel, children }) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={16} color={project.color} /></div>
          <h2 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>{title}</h2>
        </div>
        <button type="button" onClick={onAdd} className="btn-primary shrink-0" style={{ background: project.color }}>
          <Plus size={13} /> {addLabel}
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <Section icon={AlertCircle} title="Alertas mais comuns" onAdd={() => openModal('alerta', 'add')} addLabel="Adicionar Alerta">
        <div className="flex flex-col gap-3">
          {alertas.map((a) => (
            <div key={a.id} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <code className="text-[12px] font-bold px-2.5 py-1 rounded-md" style={{ background: '#F3F4F6', color: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{a.nome}</code>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sevBg(a.severidade), color: sevColor(a.severidade) }}>{a.severidade}</span>
                </div>
                <RowActions project={project} onEdit={() => openModal('alerta', 'edit', a)} onDelete={() => setDelTarget({ type: 'alerta', item: a })} />
              </div>
              <p className="text-[12.5px]" style={{ color: '#4B5563' }}><strong style={{ color: 'var(--ink-primary)' }}>O que significa:</strong> {a.significado}</p>
              <p className="text-[12.5px]" style={{ color: '#4B5563' }}><strong style={{ color: project.color }}>Ação:</strong> {a.acao}</p>
            </div>
          ))}
          {alertas.length === 0 && <EmptyState icon={AlertCircle} title="Nenhum alerta cadastrado" />}
        </div>
      </Section>

      <Section icon={Stethoscope} title="Passos para diagnosticar problemas" onAdd={() => openModal('diag', 'add')} addLabel="Adicionar Passo">
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          {diag.length === 0 && <EmptyState icon={Stethoscope} title="Nenhum passo cadastrado" />}
          {diag.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i === 0 ? 'none' : '1px solid #F0F2F5' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: project.color }}>{i + 1}</span>
              <p className="text-[13px] flex-1" style={{ color: '#4B5563' }}>{p.text}</p>
              <RowActions project={project} onEdit={() => openModal('diag', 'edit', p)} onDelete={() => setDelTarget({ type: 'diag', item: p })} />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={PhoneCall} title="Com quem falar para cada tipo de problema" onAdd={() => openModal('contato', 'add')} addLabel="Adicionar Contato">
        <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
          {contatos.length === 0 ? <EmptyState icon={PhoneCall} title="Nenhum contato cadastrado" /> : (
            <table className="w-full text-left">
              <thead><tr style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>{['Tipo de Problema', 'Responsável', 'Canal', ''].map((h) => <th key={h} className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: '#9CA3AF' }}>{h}</th>)}</tr></thead>
              <tbody>
                {contatos.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB' }}>
                    <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{c.problema}</td>
                    <td className="px-4 py-3 text-[12.5px]" style={{ color: '#4B5563' }}>{c.responsavel}</td>
                    <td className="px-4 py-3"><code className="text-[12px] font-medium px-2 py-0.5 rounded" style={{ background: project.soft, color: project.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.canal}</code></td>
                    <td className="px-4 py-3"><RowActions project={project} onEdit={() => openModal('contato', 'edit', c)} onDelete={() => setDelTarget({ type: 'contato', item: c })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Section>

      <Section icon={Terminal} title="Onde ver logs (e como filtrar o útil)" onAdd={() => openModal('log', 'add')} addLabel="Adicionar Log">
        <div className="flex flex-col gap-3">
          {logs.length === 0 && <EmptyState icon={Terminal} title="Nenhum log cadastrado" />}
          {logs.map((l) => (
            <div key={l.id} className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[13px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{l.sistema}</p>
                <RowActions project={project} onEdit={() => openModal('log', 'edit', l)} onDelete={() => setDelTarget({ type: 'log', item: l })} />
              </div>
              <p className="text-[12.5px] mb-2" style={{ color: '#4B5563' }}><strong style={{ color: 'var(--ink-primary)' }}>Onde:</strong> {l.onde}</p>
              <div className="rounded-lg px-3 py-2" style={{ background: '#0F172A' }}>
                <code className="text-[11.5px]" style={{ color: '#5FE3C1', fontFamily: "'JetBrains Mono', monospace" }}>{l.filtro}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={MessageSquare} title="Canal de comunicação do time" onAdd={() => openModal('canal', 'add')} addLabel="Adicionar Canal">
        <div className="grid sm:grid-cols-2 gap-3">
          {canais.length === 0 && <div className="col-span-2"><EmptyState icon={MessageSquare} title="Nenhum canal cadastrado" /></div>}
          {canais.map((c) => (
            <div key={c.id} className="rounded-xl p-4 flex items-start gap-3 relative" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: project.soft }}><MessageSquare size={15} color={project.color} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="text-[12px] font-bold truncate" style={{ color: project.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.nome}</code>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>{c.plataforma}</span>
                </div>
                <p className="text-[12px]" style={{ color: '#4B5563' }}>{c.descricao}</p>
              </div>
              <div className="absolute top-2 right-2"><RowActions project={project} onEdit={() => openModal('canal', 'edit', c)} onDelete={() => setDelTarget({ type: 'canal', item: c })} /></div>
            </div>
          ))}
        </div>
      </Section>

      {modal && (
        <CrudModal project={project} title={modal.mode === 'add' ? 'Adicionar' : 'Editar'} icon={modal.mode === 'add' ? Plus : Pencil} onClose={() => setModal(null)} onSave={save} saveLabel={modal.mode === 'add' ? 'Salvar' : 'Salvar Alterações'}>
          {modal.type === 'alerta' && <>
            <Field label="Nome do alerta" required><FInput value={form.nome || ''} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} placeholder="Ex: HIGH_LATENCY_PIX" /></Field>
            <Field label="Severidade"><FSelect value={form.severidade || 'Alta'} onChange={(v) => setForm((f) => ({ ...f, severidade: v }))} options={['Alta', 'Média', 'Baixa']} /></Field>
            <Field label="O que significa" required><FTextarea value={form.significado || ''} onChange={(v) => setForm((f) => ({ ...f, significado: v }))} placeholder="Descreva o que este alerta indica…" rows={2} /></Field>
            <Field label="Ação recomendada" required><FTextarea value={form.acao || ''} onChange={(v) => setForm((f) => ({ ...f, acao: v }))} placeholder="O que fazer quando este alerta dispara?" rows={2} /></Field>
          </>}
          {modal.type === 'diag' && (
            <Field label="Passo" required><FTextarea value={form.text || ''} onChange={(v) => setForm((f) => ({ ...f, text: v }))} placeholder="Descreva este passo de diagnóstico…" rows={3} /></Field>
          )}
          {modal.type === 'contato' && <>
            <Field label="Tipo de problema" required><FInput value={form.problema || ''} onChange={(v) => setForm((f) => ({ ...f, problema: v }))} placeholder="Ex: Falha no Pix" /></Field>
            <Field label="Responsável" required><FInput value={form.responsavel || ''} onChange={(v) => setForm((f) => ({ ...f, responsavel: v }))} placeholder="Ex: Marina Tassi (Tech Lead)" /></Field>
            <Field label="Canal" required><FInput value={form.canal || ''} onChange={(v) => setForm((f) => ({ ...f, canal: v }))} placeholder="Ex: #incidentes-banking" /></Field>
          </>}
          {modal.type === 'log' && <>
            <Field label="Sistema" required><FInput value={form.sistema || ''} onChange={(v) => setForm((f) => ({ ...f, sistema: v }))} placeholder="Ex: API de pagamentos" /></Field>
            <Field label="Onde acessar" required><FInput value={form.onde || ''} onChange={(v) => setForm((f) => ({ ...f, onde: v }))} placeholder="Ex: Datadog → Services → api-pix" /></Field>
            <Field label="Filtro recomendado" required><FTextarea value={form.filtro || ''} onChange={(v) => setForm((f) => ({ ...f, filtro: v }))} placeholder="Ex: service:pix-processor level:ERROR" rows={2} /></Field>
          </>}
          {modal.type === 'canal' && <>
            <Field label="Nome do canal" required><FInput value={form.nome || ''} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} placeholder="Ex: #banking-geral" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Plataforma"><FSelect value={form.plataforma || 'Slack'} onChange={(v) => setForm((f) => ({ ...f, plataforma: v }))} options={['Slack', 'Teams', 'Discord', 'Jira', 'Confluence', 'Outro']} /></Field>
              <Field label="Descrição"><FInput value={form.descricao || ''} onChange={(v) => setForm((f) => ({ ...f, descricao: v }))} placeholder="Para que serve este canal?" /></Field>
            </div>
          </>}
        </CrudModal>
      )}
      {delTarget && <ConfirmDeleteModal project={project} message="Deseja excluir este item?" onConfirm={del} onClose={() => setDelTarget(null)} />}
    </div>
  );
}

export default ProjectOperacao;
