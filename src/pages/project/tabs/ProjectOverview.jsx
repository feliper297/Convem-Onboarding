import React from 'react';

function ProjectOverview({ project }) {
  return (
    <div className="card-padded min-w-0">
      <h2 className="section-title mb-2">Sobre o projeto</h2>
      <p className="text-sm leading-relaxed break-words text-ink-secondary">{project.description}</p>
    </div>
  );
}

export default ProjectOverview;
