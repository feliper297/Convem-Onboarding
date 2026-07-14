import { Info, ListChecks, BookOpen, BookMarked, Users, Network, Calendar, Activity, HelpCircle } from 'lucide-react';

const NAV_ITEMS = [
  { id: "overview", label: "Visão Geral", icon: Info },
  { id: "trilha", label: "Trilha de Onboarding", icon: ListChecks },
  { id: "docs", label: "Documentação", icon: BookOpen },
  { id: "glossario", label: "Glossário", icon: BookMarked },
  { id: "pessoas", label: "Time", icon: Users },
  { id: "stakeholders", label: "Stakeholders", icon: Network },
  { id: "reunioes", label: "Reuniões", icon: Calendar },
  { id: "operacao", label: "Operação e Suporte", icon: Activity },
  { id: "faq", label: "Perguntas Frequentes", icon: HelpCircle },
];

export { NAV_ITEMS };
