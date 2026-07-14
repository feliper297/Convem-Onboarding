import React, { useState, useEffect } from 'react';
import {
  Home, Settings, User, Search, ChevronRight, ChevronDown, CheckCircle2, Circle,
  Star, Bell, Menu, X, FileText, GitBranch, ListChecks, BookOpen, Users, HelpCircle,
  Sparkles, ArrowRight, ArrowLeft, Building2, Smartphone, CreditCard, ShieldCheck,
  BarChart3, Clock, ExternalLink, Filter, Loader2, Inbox, Link2, Mail, Phone,
  MapPin, Layers, Code2, Database, Workflow, BookMarked, PartyPopper, Trophy,
  PlayCircle, FileCode2, ListTree, ChevronLeft, Hash, Info, Target,
  Plus, Pencil, Trash2, CalendarDays, User2,
  Network, Calendar, Activity, AlertCircle, Terminal, MessageSquare, Video, Stethoscope, PhoneCall, TrendingUp
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import { SEED_DOCS } from '../../data/seedDocs';
import ProgressBar from '../../components/ui/ProgressBar';
import Loading from '../../components/ui/Loading';
import ProjectOverview from './tabs/ProjectOverview';
import ProjectTrilha from './tabs/ProjectTrilha';
import ProjectGlossario from './tabs/ProjectGlossario';
import ProjectPessoas from './tabs/ProjectPessoas';
import ProjectStakeholders from './tabs/ProjectStakeholders';
import ProjectReunioes from './tabs/ProjectReunioes';
import ProjectFaq from './tabs/ProjectFaq';
import ProjectOperacao from './tabs/ProjectOperacao';
import ProjectDocs from './docs/ProjectDocs';
import DocsCategoryDetail from './docs/DocsCategoryDetail';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProjectPage({ project, route, setRoute, completed, toggleTrilhaItem, docsRead, toggleDocsRead, pushToast }) {
  const [loading, setLoading] = useState(true);
  const [docsCategory, setDocsCategory] = useState(null);
  const [docsData, setDocsData] = useState(() => SEED_DOCS[project.id] || {});

  useEffect(() => { setLoading(true); setDocsCategory(null); const t = setTimeout(() => setLoading(false), 280); return () => clearTimeout(t); }, [route.tab, route.projectId]);
  useEffect(() => { setDocsData(SEED_DOCS[project.id] || {}); setDocsCategory(null); }, [project.id]);

  const handleAddDoc = (category, doc) => { setDocsData((prev) => ({ ...prev, [category]: [...(prev[category] || []), doc] })); pushToast(`Documento "${doc.title}" adicionado!`, "success"); };
  const handleDeleteCategoryDocs = (category) => { setDocsData((prev) => ({ ...prev, [category]: [] })); pushToast(`Documentos de "${category}" removidos.`, "default"); };
  const handleDeleteDoc = (category, docId) => { setDocsData((prev) => ({ ...prev, [category]: (prev[category] || []).filter((d) => d.id !== docId) })); pushToast("Documento removido.", "default"); };

  const Icon = project.icon;
  const completedItems = completed[project.id] || [];
  const progress = pct(completedItems.length, project.trilha.length);
  const onToggleTrilha = (idx) => { const willComplete = !completedItems.includes(idx); toggleTrilhaItem(project.id, idx); if (willComplete) pushToast(`"${project.trilha[idx]}" concluído`, "success"); };

  return (
    <div className="flex flex-col gap-5 max-w-[1180px]">
      <div className="flex items-start sm:items-center gap-3.5 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={20} color={project.color} /></div>
          <div>
            <h1 className="text-[19px] font-bold" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h1>
            <p className="text-[12.5px]" style={{ color: "#5B6472" }}>{project.tagline}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl px-5 py-4 w-full" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold" style={{ color: "#14171F" }}>Progresso da trilha</span>
          <span className="text-[13px] font-bold" style={{ color: project.color }}>{progress}%</span>
        </div>
        <ProgressBar value={progress} color={project.color} height={8} />
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" style={{ borderBottom: "1px solid #E4E7EC" }}>
        {NAV_ITEMS.map((n) => {
          const NIcon = n.icon; const active = (route.tab || "overview") === n.id;
          return (
            <button key={n.id} onClick={() => { setRoute({ view: "project", projectId: project.id, tab: n.id }); setDocsCategory(null); }} className="flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors shrink-0" style={{ color: active ? project.color : "#5B6472", borderBottom: active ? `2px solid ${project.color}` : "2px solid transparent" }}>
              <NIcon size={13.5} /> {n.label}
            </button>
          );
        })}
      </div>
      <div>
        {loading ? <Loading /> : (
          <>
            {route.tab === "overview" && <ProjectOverview project={project} />}
            {route.tab === "trilha" && <ProjectTrilha project={project} completedItems={completedItems} onToggle={onToggleTrilha} />}
            {route.tab === "docs" && (
              docsCategory ? (
                <DocsCategoryDetail project={project} category={docsCategory} docs={docsData[docsCategory] || []} onBack={() => setDocsCategory(null)} onAddDoc={handleAddDoc} onDeleteDoc={handleDeleteDoc} />
              ) : (
                <ProjectDocs project={project} onViewCategory={setDocsCategory} docsData={docsData} onAddDoc={handleAddDoc} onDeleteCategoryDocs={handleDeleteCategoryDocs} />
              )
            )}
            {route.tab === "glossario" && <ProjectGlossario project={project} pushToast={pushToast} />}
            {route.tab === "pessoas" && <ProjectPessoas project={project} pushToast={pushToast} />}
            {route.tab === "stakeholders" && <ProjectStakeholders project={project} pushToast={pushToast} />}
            {route.tab === "reunioes" && <ProjectReunioes project={project} pushToast={pushToast} />}
            {route.tab === "operacao" && <ProjectOperacao project={project} pushToast={pushToast} />}
            {route.tab === "faq" && <ProjectFaq project={project} pushToast={pushToast} />}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;
