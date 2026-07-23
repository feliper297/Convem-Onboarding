import React, { useRef, useState, useEffect } from 'react';
import { Building2, CheckCircle2, Clock, BarChart3, ArrowRight } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import SummaryCard from '../components/ui/SummaryCard';
import EmptyState from '../components/ui/EmptyState';

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function ProjectCard({ project, progress, onEnter, innerRef }) {
  const Icon = project.icon;
  return (
    <div ref={innerRef} className="card-padded-lg flex flex-col gap-4 hover:shadow-elevated transition-shadow h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 border"
            style={{ background: project.soft, borderColor: `${project.color}22` }}
          >
            <Icon size={17} color={project.color} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-ink-primary truncate">{project.name}</p>
            <p className="text-xs text-ink-secondary truncate mt-0.5">{project.tagline}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-ink-secondary">Progresso da trilha</span>
          <span className="text-xs font-semibold tabular-nums" style={{ color: project.color }}>
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} color={project.color} />
      </div>

      <button type="button" onClick={onEnter} className="btn-primary w-full py-2" style={{ background: project.color }}>
        Acessar projeto
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function Dashboard({ setRoute, projects, completed, userName }) {
  const projectCardRef = useRef(null);
  const [projectCardHeight, setProjectCardHeight] = useState(null);

  useEffect(() => {
    const el = projectCardRef.current;
    if (!el) {
      setProjectCardHeight(null);
      return undefined;
    }

    const media = window.matchMedia('(min-width: 1024px)');
    const updateHeight = () => {
      setProjectCardHeight(media.matches ? el.offsetHeight : null);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    media.addEventListener('change', updateHeight);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateHeight);
    };
  }, [projects]);

  const totalTrilhas = projects.length;
  const projectProgress = (p) => pct((completed[p.id] || []).length, p.trilha.length);
  const concluded = projects.filter((p) => projectProgress(p) === 100).length;
  const pending = totalTrilhas - concluded;
  const overall = totalTrilhas
    ? Math.round(projects.reduce((acc, p) => acc + projectProgress(p), 0) / totalTrilhas)
    : 0;

  const recentProgress = projects
    .flatMap((p) => {
      const doneIds = completed[p.id] || [];
      return p.trilha
        .filter((item) => doneIds.includes(item.id))
        .map((item) => ({ project: p, item }));
    })
    .slice(0, 4);

  const firstName = userName.split(' ')[0];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Olá, {firstName}. Acompanhe seus projetos e o progresso das trilhas de onboarding.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard icon={Building2} label="Projetos disponíveis" value={totalTrilhas} />
        <SummaryCard icon={CheckCircle2} label="Trilhas concluídas" value={concluded} />
        <SummaryCard icon={Clock} label="Trilhas pendentes" value={pending} />
        <SummaryCard icon={BarChart3} label="Progresso geral" value={`${overall}%`} />
      </div>

      <div>
        <h2 className="section-title mb-3">Seus projetos</h2>
        {projects.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhum projeto disponível"
            description="Crie um novo projeto para começar."
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
            <div className="grid sm:grid-cols-2 gap-3 items-start">
              {projects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  innerRef={index === 0 ? projectCardRef : null}
                  project={p}
                  progress={projectProgress(p)}
                  onEnter={() => setRoute({ view: 'project', projectId: p.id, tab: 'overview' })}
                />
              ))}
            </div>

            <div
              className="card-padded-lg flex flex-col min-h-0 overflow-hidden"
              style={projectCardHeight ? { height: projectCardHeight } : undefined}
            >
              <h2 className="section-title mb-4 shrink-0">Atividade recente</h2>
              {recentProgress.length === 0 ? (
                <p className="text-sm text-ink-muted">Nenhum passo concluído ainda.</p>
              ) : (
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                  {recentProgress.map(({ project, item }, i) => (
                    <div key={item.id} className="flex gap-3 shrink-0">
                      <div className="flex flex-col items-center pt-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: project.color }}
                        />
                        {i < recentProgress.length - 1 && (
                          <span className="w-px flex-1 my-1 bg-border min-h-[16px]" />
                        )}
                      </div>
                      <div className={`pb-3 ${i === recentProgress.length - 1 ? 'pb-0' : ''}`}>
                        <p className="text-[13px] font-medium text-ink-primary leading-snug">{item.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{project.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
