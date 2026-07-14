import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, User2, CalendarDays, ExternalLink, Trash2 } from 'lucide-react';
import { DOC_ICONS } from '../../../data/seedDocs';
import DocModal from './DocModal';

function DocsCategoryDetail({ project, category, docs, onBack, onAddDoc, onDeleteDoc }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Documento", author: "", url: "", category });
  const [formError, setFormError] = useState("");
  const Icon = DOC_ICONS[category] || FileText;

  const handleSave = () => {
    if (!form.title.trim()) { setFormError("O título é obrigatório."); return; }
    if (!form.author.trim()) { setFormError("O autor é obrigatório."); return; }
    onAddDoc(category, { ...form, id: Date.now(), date: new Date().toLocaleDateString("pt-BR") });
    setForm({ title: "", type: "Documento", author: "", url: "", category });
    setFormError(""); setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[900px]">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-lg" style={{ color: "#5B6472", background: "#F7F8FA", border: "1px solid #E4E7EC" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#EEF0F3"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#F7F8FA"; }}>
          <ArrowLeft size={15} /> Voltar
        </button>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: project.soft }}><Icon size={16} color={project.color} /></span>
          <h2 className="text-[17px] font-bold" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>{category}</h2>
        </div>
        <div className="ml-auto">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: project.color }} onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.88; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}>
            <Plus size={15} /> Adicionar Documentação
          </button>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E7EC" }}>
        {docs.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#F7F8FA" }}><Icon size={20} color="#9AA2B1" /></div>
            <p className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>Nenhum documento ainda</p>
            <p className="text-[12.5px]" style={{ color: "#5B6472" }}>Clique em "Adicionar Documentação" para inserir o primeiro.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E4E7EC" }}>
                {["Título","Tipo","Autor","Data","Link",""].map((h, i) => <th key={i} className="text-[11px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: "#9AA2B1" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => (
                <tr key={doc.id} style={{ borderTop: i === 0 ? "none" : "1px solid #E4E7EC" }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: project.soft }}><FileText size={13} color={project.color} /></div>
                      <span className="text-[13px] font-semibold" style={{ color: "#14171F" }}>{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-[11.5px] font-medium px-2.5 py-1 rounded-full" style={{ background: project.soft, color: project.color }}>{doc.type}</span></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#5B6472" }}><User2 size={12} /> {doc.author}</div></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1.5 text-[12.5px]" style={{ color: "#5B6472" }}><CalendarDays size={12} /> {doc.date}</div></td>
                  <td className="px-4 py-3.5">{doc.url && doc.url !== "#" ? <a href={doc.url} className="flex items-center gap-1 text-[12px] font-medium" style={{ color: project.color }}>Abrir <ExternalLink size={11} /></a> : <span className="text-[12px]" style={{ color: "#C2C8D2" }}>—</span>}</td>
                  <td className="px-4 py-3.5"><button onClick={() => onDeleteDoc(category, doc.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#C2C8D2" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#C2C8D2"; e.currentTarget.style.background = "transparent"; }}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && <DocModal project={project} form={form} setForm={setForm} mode="add" error={formError} onSave={handleSave} onClose={() => { setShowModal(false); setFormError(""); }} />}
    </div>
  );
}

export default DocsCategoryDetail;
