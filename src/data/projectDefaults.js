import {
  Smartphone, CreditCard, BarChart3, ShieldCheck, Building2,
  Layers, Code2, Database, Workflow, Globe,
} from 'lucide-react';

const DEFAULT_TRILHA = [
  "Conhecer o produto",
  "Instalar ambiente",
  "Configurar acessos",
  "Ler documentação",
  "Assistir vídeos",
  "Realizar treinamento",
  "Fazer exercício prático",
  "Validar conhecimentos",
];

const DEFAULT_DOCS = {
  "Arquitetura": [],
  "Regras de negócio": [],
  "Fluxos": [],
  "Design System": [],
  "APIs": [],
  "Banco de Dados": [],
  "Padrões de Código": [],
  "Boas práticas": [],
};

const PROJECT_COLORS = [
  { color: "#0E7C66", soft: "#E6F4F1", label: "Verde" },
  { color: "#2754C5", soft: "#EAF0FD", label: "Azul" },
  { color: "#B45309", soft: "#FDF1E3", label: "Laranja" },
  { color: "#6E3AAE", soft: "#F1EAFB", label: "Roxo" },
];

const PROJECT_ICONS = [
  { id: "smartphone", icon: Smartphone, label: "Mobile" },
  { id: "credit-card", icon: CreditCard, label: "Pagamentos" },
  { id: "bar-chart", icon: BarChart3, label: "Dashboard" },
  { id: "shield", icon: ShieldCheck, label: "Segurança" },
  { id: "building", icon: Building2, label: "Empresa" },
  { id: "layers", icon: Layers, label: "Plataforma" },
  { id: "code", icon: Code2, label: "Código" },
  { id: "database", icon: Database, label: "Dados" },
  { id: "workflow", icon: Workflow, label: "Fluxos" },
  { id: "globe", icon: Globe, label: "Web" },
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createProject({ id, name, tagline, description, techLead, techLeadEmail, icon, color, soft }) {
  return {
    id,
    name,
    tagline: tagline || description || name,
    icon,
    color,
    soft,
    description: description || tagline || name,
    objectives: [],
    metrics: [],
    tech: [],
    team: { lead: techLead, size: 1, squads: [] },
    contacts: [{ name: techLead, role: "Tech Lead", contact: techLeadEmail || "" }],
    links: [
      { label: "Repositório principal", url: "#" },
      { label: "Board do projeto", url: "#" },
    ],
    trilha: [...DEFAULT_TRILHA],
    docs: { ...DEFAULT_DOCS },
    glossario: [],
    pessoas: [{
      name: techLead,
      role: "Tech Lead",
      area: "Engenharia",
      contact: techLeadEmail || "",
      specialty: "",
    }],
    faq: {},
    stakeholders: [],
    reunioes: [],
    operacao: {
      alertas: [],
      diagnostico: [],
      contatos: [],
      logs: [],
      canais: [],
    },
  };
}

export {
  DEFAULT_TRILHA,
  PROJECT_COLORS,
  PROJECT_ICONS,
  slugify,
  createProject,
};
