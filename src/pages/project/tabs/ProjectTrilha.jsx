import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import ProgressBar from '../../../components/ui/ProgressBar';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProjectTrilha({ project, completedItems, onToggle }) {
  const progress = pct(completedItems.length, project.trilha.length);
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {project.trilha.map((item, i) => {
          const done = completedItems.includes(i);
          return (
            <div key={i} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <button onClick={() => onToggle(i)} className="mt-0.5">{done ? <CheckCircle2 size={20} color={project.color} fill={project.soft} /> : <Circle size={20} color="#C2C8D2" />}</button>
                {i < project.trilha.length - 1 && <span className="w-px flex-1 my-1" style={{ background: "#E4E7EC" }} />}
              </div>
              <button onClick={() => onToggle(i)} className={`text-left pb-6 flex-1 ${i === project.trilha.length - 1 ? "pb-0" : ""}`}>
                <p className="text-[14px] font-semibold transition-colors" style={{ color: done ? "#9AA2B1" : "#14171F", textDecoration: done ? "line-through" : "none" }}>{item}</p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Modal shared between DocsCategoryDetail and ProjectDocs ── */

export default ProjectTrilha;
