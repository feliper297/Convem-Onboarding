import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, User2, CalendarDays, ExternalLink, Trash2 } from 'lucide-react';
import { DOC_ICONS } from '../../../data/docConstants';
import DocModal from './DocModal';
import { uploadProjectDocument } from '../../../services/storageService';
import EmptyState from '../../../components/ui/EmptyState';

function DocsCategoryDetail({ project, category, docs, onBack, onAddDoc, onDeleteDoc, canEdit = false }) {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Documento', author: '', url: '', category });
  const [formError, setFormError] = useState('');
  const Icon = DOC_ICONS[category] || FileText;

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
      await onAddDoc(category, {
        title: payload.title,
        type: payload.type,
        author: payload.author,
        url,
      });
      setForm({ title: '', type: 'Documento', author: '', url: '', category });
      setFormError('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Erro ao salvar documento.');
    } finally {
      setSaving(false);
    }
  };

  const headers = ['Título', 'Tipo', 'Autor', 'Data', 'Link', ...(canEdit ? [''] : [])];

  return (
    <div className="flex flex-col gap-5 max-w-[900px]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="btn-secondary">
          <ArrowLeft size={15} /> Voltar
        </button>
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md border"
            style={{ background: project.soft, borderColor: `${project.color}22` }}
          >
            <Icon size={16} color={project.color} />
          </span>
          <h2 className="text-base font-semibold text-ink-primary">{category}</h2>
        </div>
        {canEdit && (
          <div className="ml-auto">
            <button type="button" onClick={() => setShowModal(true)} className="btn-primary" style={{ background: project.color }}>
              <Plus size={15} /> Adicionar Documentação
            </button>
          </div>
        )}
      </div>

      <div className="table-shell">
        {docs.length === 0 ? (
          <EmptyState icon={Icon} title="Nenhum documento ainda" description='Clique em "Adicionar Documentação" para inserir o primeiro.' />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h || 'actions'} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-surface">
                {docs.map((doc, i) => (
                  <tr key={doc.id} className={i > 0 ? 'border-t border-border' : ''}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{ background: project.soft }}
                        >
                          <FileText size={13} color={project.color} />
                        </div>
                        <span className="text-[13px] font-semibold text-ink-primary">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                        style={{ background: project.soft, color: project.color }}
                      >
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-ink-secondary">
                        <User2 size={12} /> {doc.author}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-ink-secondary">
                        <CalendarDays size={12} /> {doc.date}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {doc.url && doc.url !== '#' ? (
                        <a
                          href={doc.url}
                          className="flex items-center gap-1 text-[12px] font-medium"
                          style={{ color: project.color }}
                        >
                          Abrir <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-[12px] text-ink-faint">—</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => onDeleteDoc(category, doc.id)}
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger"
                          aria-label={`Excluir ${doc.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <DocModal
          project={project}
          form={form}
          setForm={setForm}
          mode="add"
          error={formError}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setFormError(''); setSaving(false); }}
          saving={saving}
        />
      )}
    </div>
  );
}

export default DocsCategoryDetail;
