/**
 * Gera SQL de seed a partir dos dados mockados em src/data/
 * Uso: node scripts/generate-seed-sql.mjs > scripts/seed.sql
 */
import { writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const { PROJECTS } = await import(pathToFileURL(join(root, 'src/data/projects.js')).href);
const { SEED_DOCS } = await import(pathToFileURL(join(root, 'src/data/seedDocs.js')).href);

const ICON_MAP = {
  'app-banking': 'smartphone',
  tupi: 'credit-card',
  'convem-board': 'bar-chart',
  'reg-plus': 'shield',
};

function esc(str) {
  if (str == null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function json(val) {
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
}

function parseDateBR(str) {
  if (!str) return 'NULL';
  const [d, m, y] = str.split('/');
  return `'${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}'::date`;
}

const lines = ['BEGIN;', ''];

for (const p of PROJECTS) {
  lines.push(`-- Projeto: ${p.name}`);
  lines.push(`INSERT INTO public.projects (id, name, tagline, icon, color, soft, description, objectives, metrics, tech, team, trilha)`);
  lines.push(`VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.tagline)}, ${esc(ICON_MAP[p.id] || 'building')}, ${esc(p.color)}, ${esc(p.soft)}, ${esc(p.description)}, ${json(p.objectives)}, ${json(p.metrics)}, ${json(p.tech)}, ${json(p.team)}, ${json(p.trilha)})`);
  lines.push(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, icon = EXCLUDED.icon, color = EXCLUDED.color, soft = EXCLUDED.soft, description = EXCLUDED.description, objectives = EXCLUDED.objectives, metrics = EXCLUDED.metrics, tech = EXCLUDED.tech, team = EXCLUDED.team, trilha = EXCLUDED.trilha, updated_at = now();`);
  lines.push('');

  (p.contacts || []).forEach((c, i) => {
    lines.push(`INSERT INTO public.project_contacts (project_id, name, role, contact, sort_order) VALUES (${esc(p.id)}, ${esc(c.name)}, ${esc(c.role)}, ${esc(c.contact)}, ${i});`);
  });

  (p.links || []).forEach((l, i) => {
    lines.push(`INSERT INTO public.project_links (project_id, label, url, sort_order) VALUES (${esc(p.id)}, ${esc(l.label)}, ${esc(l.url)}, ${i});`);
  });

  (p.pessoas || []).forEach((person, i) => {
    lines.push(`INSERT INTO public.project_people (project_id, name, role, area, contact, specialty, sort_order) VALUES (${esc(p.id)}, ${esc(person.name)}, ${esc(person.role)}, ${esc(person.area)}, ${esc(person.contact)}, ${esc(person.specialty)}, ${i});`);
  });

  (p.stakeholders || []).forEach((s, i) => {
    lines.push(`INSERT INTO public.project_stakeholders (project_id, name, role, area, contact, influence, interest, expectativa, sort_order) VALUES (${esc(p.id)}, ${esc(s.name)}, ${esc(s.role)}, ${esc(s.area)}, ${esc(s.contact)}, ${esc(s.influence)}, ${esc(s.interest)}, ${esc(s.expectativa)}, ${i});`);
  });

  (p.reunioes || []).forEach((r, i) => {
    lines.push(`INSERT INTO public.project_meetings (project_id, name, frequency, duration, meeting_time, participants, descricao, link, sort_order) VALUES (${esc(p.id)}, ${esc(r.name)}, ${esc(r.frequency)}, ${esc(r.duration)}, ${esc(r.time)}, ${json(r.participants || [])}, ${esc(r.descricao)}, ${esc(r.link)}, ${i});`);
  });

  (p.glossario || []).forEach((g, i) => {
    lines.push(`INSERT INTO public.project_glossary (project_id, term, definition, sort_order) VALUES (${esc(p.id)}, ${esc(g.term)}, ${esc(g.def)}, ${i});`);
  });

  if (p.faq) {
    let faqIdx = 0;
    for (const [category, items] of Object.entries(p.faq)) {
      for (const item of items) {
        lines.push(`INSERT INTO public.project_faq (project_id, category, question, answer, sort_order) VALUES (${esc(p.id)}, ${esc(category)}, ${esc(item.q)}, ${esc(item.a)}, ${faqIdx++});`);
      }
    }
  }

  const docs = SEED_DOCS[p.id] || {};
  let docIdx = 0;
  for (const [category, items] of Object.entries(docs)) {
    for (const doc of items) {
      lines.push(`INSERT INTO public.project_documents (project_id, category, title, doc_type, author, doc_date, url, sort_order) VALUES (${esc(p.id)}, ${esc(category)}, ${esc(doc.title)}, ${esc(doc.type)}, ${esc(doc.author)}, ${parseDateBR(doc.date)}, ${esc(doc.url)}, ${docIdx++});`);
    }
  }

  const op = p.operacao || {};
  (op.alertas || []).forEach((a, i) => {
    lines.push(`INSERT INTO public.project_operation_alerts (project_id, nome, severidade, significado, acao, sort_order) VALUES (${esc(p.id)}, ${esc(a.nome)}, ${esc(a.severidade)}, ${esc(a.significado)}, ${esc(a.acao)}, ${i});`);
  });
  (op.diagnostico || []).forEach((d, i) => {
    lines.push(`INSERT INTO public.project_operation_diagnostics (project_id, step_text, sort_order) VALUES (${esc(p.id)}, ${esc(d)}, ${i});`);
  });
  (op.contatos || []).forEach((c, i) => {
    lines.push(`INSERT INTO public.project_operation_contacts (project_id, problema, responsavel, canal, sort_order) VALUES (${esc(p.id)}, ${esc(c.problema)}, ${esc(c.responsavel)}, ${esc(c.canal)}, ${i});`);
  });
  (op.logs || []).forEach((l, i) => {
    lines.push(`INSERT INTO public.project_operation_logs (project_id, sistema, onde, filtro, sort_order) VALUES (${esc(p.id)}, ${esc(l.sistema)}, ${esc(l.onde)}, ${esc(l.filtro)}, ${i});`);
  });
  (op.canais || []).forEach((c, i) => {
    lines.push(`INSERT INTO public.project_operation_channels (project_id, nome, plataforma, descricao, sort_order) VALUES (${esc(p.id)}, ${esc(c.nome)}, ${esc(c.plataforma)}, ${esc(c.descricao)}, ${i});`);
  });

  lines.push('');
}

// Favorito padrão para admin existente
lines.push(`INSERT INTO public.user_favorites (user_id, project_id)`);
lines.push(`SELECT id, 'app-banking' FROM auth.users WHERE email = 'feliper297@gmail.com'`);
lines.push(`ON CONFLICT DO NOTHING;`);
lines.push('');
lines.push(`INSERT INTO public.user_trilha_progress (user_id, project_id, step_index)`);
lines.push(`SELECT id, 'app-banking', 0 FROM auth.users WHERE email = 'feliper297@gmail.com'`);
lines.push(`ON CONFLICT DO NOTHING;`);
lines.push('');
lines.push('COMMIT;');

const sql = lines.join('\n');
const outPath = join(__dirname, 'seed.sql');
writeFileSync(outPath, sql, 'utf8');
console.log(`Seed SQL gerado: ${outPath} (${sql.length} bytes)`);
