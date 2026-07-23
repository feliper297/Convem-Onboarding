import { supabase } from '../lib/supabase';

async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

async function updateRow(table, id, row) {
  const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function parseParticipants(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

// ─── Glossário ───────────────────────────────────────────────────────────────

export async function createGlossarioTerm(projectId, { term, def }) {
  return insertRow('glossario', { project_id: projectId, term, definition: def });
}

export async function updateGlossarioTerm(id, { term, def }) {
  return updateRow('glossario', id, { term, definition: def });
}

export async function deleteGlossarioTerm(id) {
  return deleteRow('glossario', id);
}

// ─── Time ────────────────────────────────────────────────────────────────────

export async function createTeamMember(projectId, { name, role, area, contact, specialty }) {
  return insertRow('team_members', { project_id: projectId, name, role, area, contact, specialty });
}

export async function updateTeamMember(id, { name, role, area, contact, specialty }) {
  return updateRow('team_members', id, { name, role, area, contact, specialty });
}

export async function deleteTeamMember(id) {
  return deleteRow('team_members', id);
}

// ─── Stakeholders ────────────────────────────────────────────────────────────

export async function createStakeholder(projectId, data) {
  return insertRow('stakeholders', {
    project_id: projectId,
    name: data.name,
    role: data.role,
    area: data.area,
    contact: data.contact,
    influence: data.influence,
    interest: data.interest,
    expectativa: data.expectativa,
  });
}

export async function updateStakeholder(id, data) {
  return updateRow('stakeholders', id, {
    name: data.name,
    role: data.role,
    area: data.area,
    contact: data.contact,
    influence: data.influence,
    interest: data.interest,
    expectativa: data.expectativa,
  });
}

export async function deleteStakeholder(id) {
  return deleteRow('stakeholders', id);
}

// ─── Reuniões ────────────────────────────────────────────────────────────────

export async function createReuniao(projectId, data) {
  return insertRow('reunioes', {
    project_id: projectId,
    name: data.name,
    description: data.descricao,
    frequency: data.frequency,
    duration: data.duration,
    time: data.time,
    participants: parseParticipants(data.participants),
    link: data.link || null,
  });
}

export async function updateReuniao(id, data) {
  return updateRow('reunioes', id, {
    name: data.name,
    description: data.descricao,
    frequency: data.frequency,
    duration: data.duration,
    time: data.time,
    participants: parseParticipants(data.participants),
    link: data.link || null,
  });
}

export async function deleteReuniao(id) {
  return deleteRow('reunioes', id);
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export async function createFaqItem(projectId, { cat, q, a }) {
  return insertRow('faq', { project_id: projectId, category: cat, question: q, answer: a });
}

export async function updateFaqItem(id, { cat, q, a }) {
  return updateRow('faq', id, { category: cat, question: q, answer: a });
}

export async function deleteFaqItem(id) {
  return deleteRow('faq', id);
}

// ─── Operação ────────────────────────────────────────────────────────────────

export async function createOperacaoAlerta(projectId, data) {
  return insertRow('operacao_alertas', {
    project_id: projectId,
    nome: data.nome,
    severidade: data.severidade,
    significado: data.significado,
    acao: data.acao,
  });
}

export async function updateOperacaoAlerta(id, data) {
  return updateRow('operacao_alertas', id, {
    nome: data.nome,
    severidade: data.severidade,
    significado: data.significado,
    acao: data.acao,
  });
}

export async function deleteOperacaoAlerta(id) {
  return deleteRow('operacao_alertas', id);
}

export async function createOperacaoDiag(projectId, text, orderIndex = 0) {
  return insertRow('operacao_diagnostico', { project_id: projectId, step_text: text, order_index: orderIndex });
}

export async function updateOperacaoDiag(id, text) {
  return updateRow('operacao_diagnostico', id, { step_text: text });
}

export async function deleteOperacaoDiag(id) {
  return deleteRow('operacao_diagnostico', id);
}

export async function createOperacaoContato(projectId, data, orderIndex = 0) {
  return insertRow('operacao_contatos', {
    project_id: projectId,
    problema: data.problema,
    responsavel: data.responsavel,
    canal: data.canal,
    order_index: orderIndex,
  });
}

export async function updateOperacaoContato(id, data) {
  return updateRow('operacao_contatos', id, {
    problema: data.problema,
    responsavel: data.responsavel,
    canal: data.canal,
  });
}

export async function deleteOperacaoContato(id) {
  return deleteRow('operacao_contatos', id);
}

export async function createOperacaoLog(projectId, data, orderIndex = 0) {
  return insertRow('operacao_logs', {
    project_id: projectId,
    sistema: data.sistema,
    onde: data.onde,
    filtro: data.filtro,
    order_index: orderIndex,
  });
}

export async function updateOperacaoLog(id, data) {
  return updateRow('operacao_logs', id, { sistema: data.sistema, onde: data.onde, filtro: data.filtro });
}

export async function deleteOperacaoLog(id) {
  return deleteRow('operacao_logs', id);
}

export async function createOperacaoCanal(projectId, data, orderIndex = 0) {
  return insertRow('operacao_canais', {
    project_id: projectId,
    nome: data.nome,
    plataforma: data.plataforma,
    descricao: data.descricao,
    order_index: orderIndex,
  });
}

export async function updateOperacaoCanal(id, data) {
  return updateRow('operacao_canais', id, { nome: data.nome, plataforma: data.plataforma, descricao: data.descricao });
}

export async function deleteOperacaoCanal(id) {
  return deleteRow('operacao_canais', id);
}

// ─── Documentação ────────────────────────────────────────────────────────────

export async function createDocument(projectId, categoryId, { title, type, author, url }, userId) {
  return insertRow('documents', {
    project_id: projectId,
    category_id: categoryId,
    title,
    type,
    author,
    url: url || null,
    created_by: userId || null,
  });
}

export async function deleteDocument(id) {
  return deleteRow('documents', id);
}

export async function deleteDocumentsByCategory(categoryId) {
  const { error } = await supabase.from('documents').delete().eq('category_id', categoryId);
  if (error) throw error;
}

export async function getCategoryIdByName(projectId, categoryName) {
  const { data, error } = await supabase
    .from('doc_categories')
    .select('id')
    .eq('project_id', projectId)
    .eq('name', categoryName)
    .single();
  if (error) throw error;
  return data.id;
}

export { formatDate };
