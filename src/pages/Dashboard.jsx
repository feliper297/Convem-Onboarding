import React from 'react';
import { Building2, CheckCircle2, Clock, BarChart3, Sparkles, ArrowRight, Star } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import SummaryCard from '../components/ui/SummaryCard';
import EmptyState from '../components/ui/EmptyState';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProjectCard({ project, progress, isFavorite, onToggleFavorite, onEnter }) {
  const Icon = project.icon;
  return (
    <div className="group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-md" style={{ background: '#fff', border: '1px solid #E4E7EC', borderLeft: `3px solid ${project.color}` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={18} color={project.color} /></div>
          <div className="min-w-0">
            <p className="font-semibold text-[14.5px] truncate" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</p>
            <p className="text-[12.5px] truncate" style={{ color: '#5B6472' }}>{project.tagline}</p>
          </div>
        </div>
        <button onClick={onToggleFavorite} className="shrink-0"><Star size={16} color="#B45309" fill={isFavorite ? '#B45309' : 'none'} /></button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11.5px] font-medium" style={{ color: '#5B6472' }}>Progresso da trilha</span>
          <span className="text-[11.5px] font-bold" style={{ color: project.color }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} />
      </div>
      <button onClick={onEnter} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors" style={{ background: project.color, color: '#fff' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.88)} onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}>
        Entrar <ArrowRight size={14} />
      </button>
    </div>
  );
}

function Dashboard({ setRoute, projects, completed, favorites, toggleFavorite, userName }) {
  const totalTrilhas = projects.length;
  const projectProgress = (p) => pct((completed[p.id] || []).length, p.trilha.length);
  const concluded = projects.filter((p) => projectProgress(p) === 100).length;
  const pending = totalTrilhas - concluded;
  const overall = totalTrilhas ? Math.round(projects.reduce((acc, p) => acc + projectProgress(p), 0) / totalTrilhas) : 0;

  const recentProgress = projects.flatMap((p) => {
    const doneIds = completed[p.id] || [];
    return p.trilha
      .filter((item) => doneIds.includes(item.id))
      .map((item) => ({ project: p, item }));
  }).slice(0, 3);

  return (
    <div className="flex flex-col gap-6 max-w-[1180px]">
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EAF6F2 0%, #FFFFFF 70%)', border: '1px solid #E4E7EC' }}>
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,124,102,0.16), transparent 70%)' }} />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: '#E6F4F1', color: '#0E7C66' }}><Sparkles size={12} /> Bem-vindo ao Portal de Onboarding</span>
          <h1 className="text-[24px] sm:text-[28px] font-bold mb-2" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>Olá, {userName.split(' ')[0]}. Vamos continuar sua jornada.</h1>
          <p className="text-[14px] max-w-xl" style={{ color: '#5B6472' }}>Acompanhe seu progresso, acesse seus projetos e conclua suas trilhas de aprendizado.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SummaryCard icon={Building2} label="Projetos disponíveis" value={totalTrilhas} accent="#2754C5" />
        <SummaryCard icon={CheckCircle2} label="Trilhas concluídas" value={concluded} accent="#0E7C66" />
        <SummaryCard icon={Clock} label="Trilhas pendentes" value={pending} accent="#B45309" />
        <SummaryCard icon={BarChart3} label="Progresso geral" value={`${overall}%`} accent="#6E3AAE" />
      </div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div>
          <h2 className="text-[15px] font-bold mb-3" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>Seus projetos</h2>
          {projects.length === 0 ? (
            <EmptyState icon={Building2} title="Nenhum projeto disponível" description="Crie um novo projeto para começar." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => <ProjectCard key={p.id} project={p} progress={projectProgress(p)} isFavorite={favorites.includes(p.id)} onToggleFavorite={() => toggleFavorite(p.id)} onEnter={() => setRoute({ view: 'project', projectId: p.id, tab: 'overview' })} />)}
            </div>
          )}
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E4E7EC' }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>Seu progresso recente</h2>
          {recentProgress.length === 0 ? (
            <p className="text-[13px]" style={{ color: '#9AA2B1' }}>Nenhum passo concluído ainda. Comece uma trilha!</p>
          ) : (
            <div className="flex flex-col">
              {recentProgress.map(({ project, item }, i) => (
                <div key={item.id} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: project.color }} />
                    {i < recentProgress.length - 1 && <span className="w-px flex-1 my-1" style={{ background: '#E4E7EC' }} />}
                  </div>
                  <div className={`pb-5 ${i === recentProgress.length - 1 ? 'pb-0' : ''}`}>
                    <p className="text-[13px] font-semibold" style={{ color: '#14171F' }}>{item.title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#5B6472' }}>{project.name} · Trilha de Onboarding</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
