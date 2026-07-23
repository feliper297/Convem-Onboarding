import {
  Smartphone,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Building2,
  Layers,
  Code2,
  Database,
  Workflow,
  Globe,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_TRILHA, DEFAULT_DOCS, PROJECT_ICONS } from '../data/projectDefaults';

const ICON_BY_NAME = {
  Smartphone,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Building2,
  Layers,
  Code2,
  Database,
  Workflow,
  Globe,
};

const DOC_CATEGORY_ICONS = {
  Arquitetura: 'Layers',
  'Regras de negócio': 'ListTree',
  Fluxos: 'Workflow',
  'Design System': 'Sparkles',
  APIs: 'Code2',
  'Banco de Dados': 'Database',
  'Padrões de Código': 'FileCode2',
  'Boas práticas': 'ShieldCheck',
};

const DOC_CATEGORY_ORDER = Object.keys(DEFAULT_DOCS);

function getIconComponent(name) {
  return ICON_BY_NAME[name] || Building2;
}

function getIconName(iconComponent) {
  const fromRegistry = PROJECT_ICONS.find(({ icon }) => icon === iconComponent);
  if (fromRegistry) {
    const match = Object.entries(ICON_BY_NAME).find(([, comp]) => comp === fromRegistry.icon);
    if (match) return match[0];
  }
  const byReference = Object.entries(ICON_BY_NAME).find(([, comp]) => comp === iconComponent);
  return byReference?.[0] || iconComponent?.displayName || iconComponent?.name || 'Building2';
}

function groupByProject(rows) {
  return rows.reduce((acc, row) => {
    const key = row.project_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

function groupFaqByProject(rows) {
  return rows.reduce((acc, row) => {
    const key = row.project_id;
    const category = row.category || 'Geral';
    if (!acc[key]) acc[key] = {};
    if (!acc[key][category]) acc[key][category] = [];
    acc[key][category].push({ id: row.id, q: row.question, a: row.answer });
    return acc;
  }, {});
}

function formatDocDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function buildDocsMap(categories, documents) {
  const docsByCategoryId = documents.reduce((acc, doc) => {
    if (!acc[doc.category_id]) acc[doc.category_id] = [];
    acc[doc.category_id].push({
      id: doc.id,
      title: doc.title,
      type: doc.type || 'Documento',
      author: doc.author || '',
      url: doc.url || '',
      date: formatDocDate(doc.created_at),
    });
    return acc;
  }, {});

  const docs = {};
  const docCategoryIds = {};
  categories
    .sort((a, b) => a.order_index - b.order_index)
    .forEach((category) => {
      docs[category.name] = docsByCategoryId[category.id] || [];
      docCategoryIds[category.name] = category.id;
    });

  return { docs, docCategoryIds };
}

function assembleProject(row, related) {
  const objectives = (related.objectives[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => item.description);

  const metrics = (related.metrics[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => ({ label: item.label, target: item.target }));

  const links = (related.links[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => ({ label: item.label, url: item.url }));

  const tech = (related.technologies[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => item.name);

  const squads = (related.squads[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => item.name);

  const trilha = (related.trilha[row.id] || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => ({ id: item.id, title: item.title }));

  const categories = related.docCategories[row.id] || [];
  const documents = related.documents[row.id] || [];
  const { docs, docCategoryIds } = buildDocsMap(categories, documents);

  const glossario = (related.glossario[row.id] || []).map((item) => ({
    id: item.id,
    term: item.term || '',
    def: item.definition || '',
  }));

  const pessoas = (related.teamMembers[row.id] || []).map((item) => ({
    id: item.id,
    name: item.name || '',
    role: item.role || '',
    area: item.area || '',
    contact: item.contact || '',
    specialty: item.specialty || '',
  }));

  const contacts = pessoas.length
    ? pessoas.map(({ name, role, contact }) => ({ name, role, contact }))
    : [{ name: row.team_lead || 'Tech Lead', role: 'Tech Lead', contact: '' }];

  const stakeholders = (related.stakeholders[row.id] || []).map((item) => ({
    id: item.id,
    name: item.name || '',
    role: item.role || '',
    area: item.area || '',
    contact: item.contact || '',
    influence: item.influence || '',
    interest: item.interest || '',
    expectativa: item.expectativa || '',
  }));

  const reunioes = (related.reunioes[row.id] || []).map((item) => ({
    id: item.id,
    name: item.name || '',
    frequency: item.frequency || '',
    duration: item.duration || '',
    time: item.time || '',
    participants: item.participants || [],
    descricao: item.description || '',
    link: item.link || '',
  }));

  const faq = Object.fromEntries(
    Object.entries(related.faq[row.id] || {}).map(([cat, qs]) => [
      cat,
      qs.map((item) => ({ id: item.id, q: item.q || '', a: item.a || '' })),
    ]),
  );

  const operacao = {
    alertas: (related.operacaoAlertas[row.id] || []).map((item) => ({
      id: item.id,
      nome: item.nome || '',
      severidade: item.severidade || '',
      significado: item.significado || '',
      acao: item.acao || '',
    })),
    diagnostico: (related.operacaoDiagnostico[row.id] || [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => ({ id: item.id, text: item.step_text || '' })),
    contatos: (related.operacaoContatos[row.id] || [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => ({
        id: item.id,
        problema: item.problema || '',
        responsavel: item.responsavel || '',
        canal: item.canal || '',
      })),
    logs: (related.operacaoLogs[row.id] || [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => ({
        id: item.id,
        sistema: item.sistema || '',
        onde: item.onde || '',
        filtro: item.filtro || '',
      })),
    canais: (related.operacaoCanais[row.id] || [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => ({
        id: item.id,
        nome: item.nome || '',
        plataforma: item.plataforma || '',
        descricao: item.descricao || '',
      })),
  };

  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || row.description || row.name,
    icon: getIconComponent(row.icon),
    color: row.color,
    soft: row.soft,
    description: row.description || row.tagline || row.name,
    objectives,
    metrics,
    tech,
    team: {
      lead: row.team_lead || '',
      size: row.team_size || 0,
      squads,
    },
    contacts,
    links,
    trilha,
    docs,
    docCategoryIds,
    glossario,
    pessoas,
    faq,
    stakeholders,
    reunioes,
    operacao,
  };
}

async function fetchRelatedData(projectIds) {
  const filter = projectIds?.length ? (q) => q.in('project_id', projectIds) : (q) => q;

  const [
    objectivesRes,
    metricsRes,
    linksRes,
    technologiesRes,
    squadsRes,
    trilhaRes,
    docCategoriesRes,
    documentsRes,
    glossarioRes,
    teamMembersRes,
    stakeholdersRes,
    reunioesRes,
    faqRes,
    operacaoAlertasRes,
    operacaoDiagnosticoRes,
    operacaoContatosRes,
    operacaoLogsRes,
    operacaoCanaisRes,
  ] = await Promise.all([
    filter(supabase.from('project_objectives').select('*')),
    filter(supabase.from('project_metrics').select('*')),
    filter(supabase.from('project_links').select('*')),
    filter(supabase.from('project_technologies').select('*')),
    filter(supabase.from('project_squads').select('*')),
    filter(supabase.from('trilha_items').select('*')),
    filter(supabase.from('doc_categories').select('*')),
    filter(supabase.from('documents').select('*')),
    filter(supabase.from('glossario').select('*')),
    filter(supabase.from('team_members').select('*')),
    filter(supabase.from('stakeholders').select('*')),
    filter(supabase.from('reunioes').select('*')),
    filter(supabase.from('faq').select('*')),
    filter(supabase.from('operacao_alertas').select('*')),
    filter(supabase.from('operacao_diagnostico').select('*')),
    filter(supabase.from('operacao_contatos').select('*')),
    filter(supabase.from('operacao_logs').select('*')),
    filter(supabase.from('operacao_canais').select('*')),
  ]);

  const responses = [
    objectivesRes, metricsRes, linksRes, technologiesRes, squadsRes, trilhaRes,
    docCategoriesRes, documentsRes, glossarioRes, teamMembersRes, stakeholdersRes,
    reunioesRes, faqRes, operacaoAlertasRes, operacaoDiagnosticoRes, operacaoContatosRes,
    operacaoLogsRes, operacaoCanaisRes,
  ];

  const firstError = responses.find((res) => res.error);
  if (firstError?.error) throw firstError.error;

  return {
    objectives: groupByProject(objectivesRes.data || []),
    metrics: groupByProject(metricsRes.data || []),
    links: groupByProject(linksRes.data || []),
    technologies: groupByProject(technologiesRes.data || []),
    squads: groupByProject(squadsRes.data || []),
    trilha: groupByProject(trilhaRes.data || []),
    docCategories: groupByProject(docCategoriesRes.data || []),
    documents: groupByProject(documentsRes.data || []),
    glossario: groupByProject(glossarioRes.data || []),
    teamMembers: groupByProject(teamMembersRes.data || []),
    stakeholders: groupByProject(stakeholdersRes.data || []),
    reunioes: groupByProject(reunioesRes.data || []),
    faq: groupFaqByProject(faqRes.data || []),
    operacaoAlertas: groupByProject(operacaoAlertasRes.data || []),
    operacaoDiagnostico: groupByProject(operacaoDiagnosticoRes.data || []),
    operacaoContatos: groupByProject(operacaoContatosRes.data || []),
    operacaoLogs: groupByProject(operacaoLogsRes.data || []),
    operacaoCanais: groupByProject(operacaoCanaisRes.data || []),
  };
}

export async function fetchSignupProjects() {
  const { data, error } = await supabase.rpc('list_active_projects_for_signup');
  if (error) throw error;
  return data || [];
}

export async function fetchProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  if (!projects?.length) return [];

  const related = await fetchRelatedData(projects.map((p) => p.id));
  return projects.map((row) => assembleProject(row, related));
}

export async function fetchProjectById(projectId) {
  const { data: row, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('active', true)
    .single();

  if (error) throw error;
  const related = await fetchRelatedData([projectId]);
  return assembleProject(row, related);
}

export async function persistProject({
  id,
  name,
  tagline,
  description,
  techLead,
  techLeadEmail,
  icon,
  color,
  soft,
}) {
  const iconName = getIconName(icon);

  const { error: projectError } = await supabase.from('projects').insert({
    id,
    name,
    tagline: tagline || description || name,
    description: description || tagline || name,
    color,
    soft,
    icon: iconName,
    team_lead: techLead,
    team_size: 1,
    active: true,
  });

  if (projectError) throw projectError;

  const inserts = await Promise.all([
    supabase.from('trilha_items').insert(
      DEFAULT_TRILHA.map((title, order_index) => ({
        project_id: id,
        title,
        order_index,
      })),
    ),
    supabase.from('doc_categories').insert(
      DOC_CATEGORY_ORDER.map((categoryName, order_index) => ({
        project_id: id,
        name: categoryName,
        icon: DOC_CATEGORY_ICONS[categoryName],
        order_index,
      })),
    ),
    supabase.from('project_links').insert([
      { project_id: id, label: 'Repositório principal', url: '#', order_index: 0 },
      { project_id: id, label: 'Board do projeto', url: '#', order_index: 1 },
    ]),
    supabase.from('team_members').insert({
      project_id: id,
      name: techLead,
      role: 'Tech Lead',
      area: 'Engenharia',
      contact: techLeadEmail || '',
      specialty: '',
    }),
  ]);

  const insertError = inserts.find((res) => res.error)?.error;
  if (insertError) {
    await supabase.from('projects').delete().eq('id', id);
    throw insertError;
  }

  return fetchProjectById(id);
}

export async function updateProject(id, {
  name,
  description,
  techLead,
  icon,
  color,
  soft,
}) {
  const iconName = getIconName(icon);

  const { error } = await supabase.from('projects').update({
    name,
    tagline: description || name,
    description: description || name,
    color,
    soft,
    icon: iconName,
    team_lead: techLead,
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw error;

  return fetchProjectById(id);
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
