import { Layers, ListTree, Workflow, Palette, Code2, Database, FileCode2, ShieldCheck } from 'lucide-react';

const DOC_ICONS = {
  Arquitetura: Layers,
  'Regras de negócio': ListTree,
  Fluxos: Workflow,
  'Design System': Palette,
  APIs: Code2,
  'Banco de Dados': Database,
  'Padrões de Código': FileCode2,
  'Boas práticas': ShieldCheck,
};

const DOC_TYPES = ['Documento', 'Diagrama', 'Fluxo', 'Referência', 'Guia', 'Apresentação', 'Vídeo', 'Outro'];

export { DOC_ICONS, DOC_TYPES };
