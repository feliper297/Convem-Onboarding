import { Layers, ListTree, Workflow, Sparkles, Code2, Database, FileCode2, ShieldCheck } from 'lucide-react';

const SEED_DOCS = {
  "app-banking": {
    "Arquitetura": [{ id: 1, title: "Visão geral de microsserviços", type: "Diagrama", author: "Marina Tassi", date: "12/03/2025", url: "#" },{ id: 2, title: "Diagrama de infraestrutura", type: "Diagrama", author: "Rafael Quintão", date: "20/04/2025", url: "#" }],
    "Regras de negócio": [{ id: 3, title: "Política de limites do Pix", type: "Documento", author: "Igor Bandeira", date: "05/05/2025", url: "#" },{ id: 4, title: "Regras de score de crédito", type: "Documento", author: "Igor Bandeira", date: "10/05/2025", url: "#" }],
    "Fluxos": [{ id: 5, title: "Fluxo de abertura de conta", type: "Fluxo", author: "Cecília Worm", date: "18/06/2025", url: "#" },{ id: 6, title: "Fluxo de contestação", type: "Fluxo", author: "Cecília Worm", date: "22/06/2025", url: "#" }],
    "Design System": [{ id: 7, title: "Biblioteca de componentes mobile", type: "Referência", author: "Cecília Worm", date: "30/07/2025", url: "#" }],
    "APIs": [{ id: 8, title: "Catálogo de endpoints internos", type: "Referência", author: "Rafael Quintão", date: "14/08/2025", url: "#" }],
    "Banco de Dados": [{ id: 9, title: "Modelo de dados de contas", type: "Documento", author: "Marina Tassi", date: "02/09/2025", url: "#" }],
    "Padrões de Código": [{ id: 10, title: "Guia de estilo React Native", type: "Guia", author: "Rafael Quintão", date: "15/09/2025", url: "#" }],
    "Boas práticas": [{ id: 11, title: "Checklist de code review", type: "Guia", author: "Marina Tassi", date: "01/10/2025", url: "#" }],
  },
  "tupi": {
    "Arquitetura": [{ id: 1, title: "Comunicação maquininha ↔ backend", type: "Diagrama", author: "Bruno Salgado", date: "10/02/2025", url: "#" }],
    "Regras de negócio": [{ id: 2, title: "Taxas e planos de antecipação", type: "Documento", author: "Heloísa Drumond", date: "15/03/2025", url: "#" }],
    "Fluxos": [{ id: 3, title: "Fluxo de ativação de maquininha", type: "Fluxo", author: "Bruno Salgado", date: "22/04/2025", url: "#" }],
    "Design System": [],
    "APIs": [{ id: 4, title: "API de recebíveis", type: "Referência", author: "Tiago Murano", date: "08/05/2025", url: "#" }],
    "Banco de Dados": [{ id: 5, title: "Modelo de transações POS", type: "Documento", author: "Bruno Salgado", date: "20/06/2025", url: "#" }],
    "Padrões de Código": [{ id: 6, title: "Guia de estilo Java", type: "Guia", author: "Tiago Murano", date: "05/07/2025", url: "#" }],
    "Boas práticas": [],
  },
  "convem-board": {
    "Arquitetura": [{ id: 1, title: "Visão geral do painel web", type: "Diagrama", author: "Patrícia Anjos", date: "14/01/2025", url: "#" }],
    "Regras de negócio": [{ id: 2, title: "Regras de conciliação financeira", type: "Documento", author: "Davi Mourão", date: "28/02/2025", url: "#" }],
    "Fluxos": [],
    "Design System": [{ id: 3, title: "Componentes web compartilhados", type: "Referência", author: "Patrícia Anjos", date: "10/03/2025", url: "#" }],
    "APIs": [{ id: 4, title: "Schema GraphQL", type: "Referência", author: "Patrícia Anjos", date: "25/04/2025", url: "#" }],
    "Banco de Dados": [],
    "Padrões de Código": [],
    "Boas práticas": [{ id: 5, title: "Checklist de acessibilidade", type: "Guia", author: "Davi Mourão", date: "12/06/2025", url: "#" }],
  },
  "reg-plus": {
    "Arquitetura": [{ id: 1, title: "Pipeline de dados regulatórios", type: "Diagrama", author: "Otávio Reszka", date: "05/03/2025", url: "#" }],
    "Regras de negócio": [{ id: 2, title: "Critérios de alerta de PLD", type: "Documento", author: "Lívia Castanho", date: "18/04/2025", url: "#" }],
    "Fluxos": [{ id: 3, title: "Fluxo de análise de alerta", type: "Fluxo", author: "Otávio Reszka", date: "30/05/2025", url: "#" }],
    "Design System": [],
    "APIs": [],
    "Banco de Dados": [{ id: 4, title: "Modelo de eventos regulatórios", type: "Documento", author: "Otávio Reszka", date: "14/07/2025", url: "#" }],
    "Padrões de Código": [{ id: 5, title: "Guia de estilo Python", type: "Guia", author: "Otávio Reszka", date: "22/08/2025", url: "#" }],
    "Boas práticas": [{ id: 6, title: "Política de retenção de dados", type: "Guia", author: "Lívia Castanho", date: "10/09/2025", url: "#" }],
  },
};

const DOC_ICONS = { "Arquitetura": Layers, "Regras de negócio": ListTree, "Fluxos": Workflow, "Design System": Sparkles, "APIs": Code2, "Banco de Dados": Database, "Padrões de Código": FileCode2, "Boas práticas": ShieldCheck };
const DOC_TYPES = ["Documento","Diagrama","Fluxo","Referência","Guia","Apresentação","Vídeo","Outro"];

export { SEED_DOCS, DOC_ICONS, DOC_TYPES };
