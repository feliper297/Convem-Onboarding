import React from 'react';
import { Link2 } from 'lucide-react';

function ProjectOverview({ project }) {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="flex flex-col gap-6 min-w-0">
        <div>
          <h2 className="text-[15px] font-bold mb-2" style={{ color: "#14171F" }}>Sobre o projeto</h2>
          <p className="text-[13.5px] leading-relaxed break-words" style={{ color: "#5B6472" }}>{project.description}</p>
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
