import React from 'react';
import { Building2, CheckCircle2, Clock, BarChart3, Sparkles, ArrowRight, Star } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import SummaryCard from '../components/ui/SummaryCard';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProjectCard({ project, progress, isFavorite, onToggleFavorite, onEnter }) {
  const Icon = project.icon;
  return (
    <div className="group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-md" style={{ background: "#fff", border: "1px solid #E4E7EC", borderLeft: `3px solid ${project.color}` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={18} color={project.color} /></div>
          <div>
            <p className="font-semibold text-[14.5px]" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</p>
            <p className="text-[12.5px]" style={{ color: "#5B6472" }}>{project.tagline}</p>
          </div>
        </div>
        <button onClick={onToggleFavorite} className="shrink-0"><Star size={16} color="#B45309" fill={isFavorite ? "#B45309" : "none"} /></button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11.5px] font-medium" style={{ color: "#5B6472" }}>Progresso da trilha</span>
          <span className="text-[11.5px] font-bold" style={{ color: project.color }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} />
      </div>
      <button onClick={onEnter} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors" style={{ background: project.color, color: "#fff" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.88)} onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}>
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
  const timeline = [
    { title: "Você concluiu 'Conhecer o produto'", subtitle: "APP Banking · Trilha de Onboarding", time: "Hoje, 09:40", color: "#0E7C66" },
    { title: "Novo conteúdo disponível", subtitle: "Tupi · Documentação de Arquitetura", time: "Ontem, 16:12", color: "#2754C5" },
    { title: "Próximo passo sugerido", subtitle: "Convem Board · Instalar ambiente", time: "Recomendado para você", color: "#B45309" },
  ];
  return (
    <div className="flex flex-col gap-6 max-w-[1180px]">
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EAF6F2 0%, #FFFFFF 70%)", border: "1px solid #E4E7EC" }}>
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(14,124,102,0.16), transparent 70%)" }} />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: "#E6F4F1", color: "#0E7C66" }}><Sparkles size={12} /> Bem-vindo ao Portal de Onboarding</span>
          <h1 className="text-[24px] sm:text-[28px] font-bold mb-2" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>Olá, {userName.split(" ")[0]}. Vamos continuar sua jornada.</h1>
          <p className="text-[14px] max-w-xl" style={{ color: "#5B6472" }}>Acompanhe seu progresso, acesse seus projetos e conclua suas trilhas de aprendizado.</p>
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
          <h2 className="text-[15px] font-bold mb-3" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>Seus projetos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} progress={projectProgress(p)} isFavorite={favorites.includes(p.id)} onToggleFavorite={() => toggleFavorite(p.id)} onEnter={() => setRoute({ view: "project", projectId: p.id, tab: "overview" })} />)}
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
          <h2 className="text-[15px] font-bold mb-4" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>Linha do tempo</h2>
          <div className="flex flex-col">
            {timeline.map((it, i) => (
              <div key={i} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: it.color }} />
                  {i < timeline.length - 1 && <span className="w-px flex-1 my-1" style={{ background: "#E4E7EC" }} />}
                </div>
                <div className={`pb-5 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-[13px] font-semibold" style={{ color: "#14171F" }}>{it.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "#5B6472" }}>{it.subtitle}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#9AA2B1" }}>{it.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
