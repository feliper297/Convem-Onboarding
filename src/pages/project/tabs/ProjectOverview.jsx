import React from 'react';
import { Link2, Target, ChevronRight } from 'lucide-react';

function ProjectOverview({ project }) {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[15px] font-bold mb-2" style={{ color: "#14171F" }}>Sobre o projeto</h2>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "#5B6472" }}>{project.description}</p>
        </div>
        <div>
          <h2 className="text-[15px] font-bold mb-2.5" style={{ color: "#14171F" }}>Objetivos</h2>
          <ul className="flex flex-col gap-2">{project.objectives.map((o, i) => <li key={i} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: "#14171F" }}><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.color }} />{o}</li>)}</ul>
        </div>

        <div>
          <h2 className="text-[15px] font-bold mb-2.5" style={{ color: "#14171F" }}>Como o sucesso é medido (métricas-chave)</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: project.soft }}><Target size={15} color={project.color} /></span>
                <div><p className="text-[12.5px] font-semibold" style={{ color: "#14171F" }}>{m.label}</p><p className="text-[12px] mt-0.5" style={{ color: project.color, fontWeight: 600 }}>{m.target}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
          <h3 className="text-[12.5px] font-semibold uppercase tracking-wide mb-3" style={{ color: "#9AA2B1" }}>Links úteis</h3>
          <div className="flex flex-col gap-2">{project.links.map((l) => <a key={l.label} href={l.url} className="flex items-center gap-2 text-[13px] font-medium hover:underline" style={{ color: project.color }}><Link2 size={13} /> {l.label}</a>)}</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview;
