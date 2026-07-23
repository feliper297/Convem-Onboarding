import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, User2, CalendarDays, ExternalLink, Trash2 } from 'lucide-react';
import { DOC_ICONS } from '../../../data/docConstants';
import DocModal from './DocModal';
import { uploadProjectDocument } from '../../../services/storageService';

function DocsCategoryDetail({ project, category, docs, onBack, onAddDoc, onDeleteDoc }) {
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

  return (
    <div className="flex flex-col gap-5 max-w-[900px]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="btn-secondary">
          <ArrowLeft size={15} /> Voltar
        </button>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-md flex items-center justify-center border" style={{ background: project.soft, borderColor: `${project.color}22` }}><Icon size={16} color={project.color} /></span>
          <h2 className="text-base font-semibold text-ink-primary">{category}</h2>
        </div>
        <div className="ml-auto">
          <button type="button" onClick={() => setShowModal(true)} className="btn-primary" style={{ background: project.color }}>
            <Plus size={15} /> Adicionar Documentação
          </button>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
        {docs.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#F3F4F6" }}><Icon size={20} color="#9CA3AF" /></div>
            <p className="text-[13.5px] font-semibold" style={{ color: "var(--ink-primary)" }}>Nenhum documento ainda</p>
            <p className="text-[12.5px]" style={{ color: "#4B5563" }}>Clique em "Adicionar Documentação" para inserir o primeiro.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "#F3F4F6", borderBottom: "1px solid #E5E7EB" }}>
                {["Título","Tipo","Autor","Data","Link",""].map((h, i) => <th key={i} className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: "#9CA3AF" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => (
                <tr key={doc.id} style={{ borderTop: i === 0 ? "none" : "1px solid #E5E7EB" }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: project.soft }}><FileText size={13} color={project.color} /></div>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ink-primary)" }}>{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-medium px-2.5 py-1 rounded-full" style={{ background: project.soft, color: project.color }}>{doc.type}</span></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#4B5563" }}><User2 size={12} /> {doc.author}</div></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#4B5563" }}><CalendarDays size={12} /> {doc.date}</div></td>
                  <td className="px-4 py-3.5">{doc.url && doc.url !== "#" ? <a href={doc.url} className="flex items-center gap-1 text-[12px] font-medium" style={{ color: project.color }}>Abrir <ExternalLink size={11} /></a> : <span className="text-[12px]" style={{ color: "#C2C8D2" }}>—</span>}</td>
                  <td className="px-4 py-3.5"><button onClick={() => onDeleteDoc(category, doc.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#C2C8D2" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#C2C8D2"; e.currentTarget.style.background = "transparent"; }}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
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
