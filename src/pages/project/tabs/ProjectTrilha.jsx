import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

function ProjectTrilha({ project, completedItems, onToggle }) {
  return (
    <div className="card-padded w-full">
      <div className="flex flex-col">
        {project.trilha.map((item, i) => {
          const done = completedItems.includes(item.id);
          return (
            <div key={item.id} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <button onClick={() => onToggle(item.id)} className="mt-0.5">{done ? <CheckCircle2 size={20} color={project.color} fill={project.soft} /> : <Circle size={20} color="#C2C8D2" />}</button>
                {i < project.trilha.length - 1 && <span className="w-px flex-1 my-1" style={{ background: '#E5E7EB' }} />}
              </div>
              <button onClick={() => onToggle(item.id)} className={`text-left pb-6 flex-1 ${i === project.trilha.length - 1 ? 'pb-0' : ''}`}>
                <p className="text-[14px] font-semibold transition-colors" style={{ color: done ? '#9CA3AF' : 'var(--ink-primary)', textDecoration: done ? 'line-through' : 'none' }}>{item.title}</p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectTrilha;
