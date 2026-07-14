/**
 * Gera SQL de seed para o schema normalizado do Portal de Onboarding.
 * Uso: node scripts/generate-normalized-seed.mjs > scripts/seed-normalized.sql
 */
import { writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const { PROJECTS } = await import(pathToFileURL(join(root, 'src/data/projects.js')).href);
const { SEED_DOCS } = await import(pathToFileURL(join(root, 'src/data/seedDocs.js')).href);

const ICON_MAP = {
  'app-banking': 'Smartphone',
  tupi: 'CreditCard',
  'convem-board': 'BarChart3',
  'reg-plus': 'ShieldCheck',
};

const DOC_CATEGORY_ICONS = {
  'Arquitetura': 'Layers',
  'Regras de negócio': 'ListTree',
  Fluxos: 'Workflow',
  'Design System': 'Sparkles',
  APIs: 'Code2',
  'Banco de Dados': 'Database',
  'Padrões de Código': 'FileCode2',
  'Boas práticas': 'ShieldCheck',
};

const DOC_CATEGORY_ORDER = [
  'Arquitetura',
  'Regras de negócio',
  'Fluxos',
  'Design System',
  'APIs',
  'Banco de Dados',
  'Padrões de Código',
  'Boas práticas',
];

function esc(str) {
  if (str == null || str === '') return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function arr(values) {
  if (!values?.length) return 'ARRAY[]::TEXT[]';
  return `ARRAY[${values.map((v) => esc(v)).join(', ')}]`;
}

const lines = ['BEGIN;', ''];

for (const p of PROJECTS) {
  lines.push(`-- ===== ${p.name} =====`);

  lines.push(
    `INSERT INTO public.projects (id, name, tagline, description, color, soft, icon, team_lead, team_size)`,
  );
  lines.push(
    `VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.tagline)}, ${esc(p.description)}, ${esc(p.color)}, ${esc(p.soft)}, ${esc(ICON_MAP[p.id])}, ${esc(p.team?.lead)}, ${p.team?.size ?? 0})`,
  );
  lines.push(
    `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description, color = EXCLUDED.color, soft = EXCLUDED.soft, icon = EXCLUDED.icon, team_lead = EXCLUDED.team_lead, team_size = EXCLUDED.team_size, updated_at = now();`,
  );
  lines.push('');

  (p.objectives || []).forEach((desc, i) => {
    lines.push(
      `INSERT INTO public.project_objectives (project_id, description, order_index) VALUES (${esc(p.id)}, ${esc(desc)}, ${i});`,
    );
  });

  (p.metrics || []).forEach((m, i) => {
    lines.push(
      `INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES (${esc(p.id)}, ${esc(m.label)}, ${esc(m.target)}, ${i});`,
    );
  });

  (p.links || []).forEach((l, i) => {
    lines.push(
      `INSERT INTO public.project_links (project_id, label, url, order_index) VALUES (${esc(p.id)}, ${esc(l.label)}, ${esc(l.url)}, ${i});`,
    );
  });

  (p.tech || []).forEach((name, i) => {
    lines.push(
      `INSERT INTO public.project_technologies (project_id, name, order_index) VALUES (${esc(p.id)}, ${esc(name)}, ${i});`,
    );
  });

  (p.team?.squads || []).forEach((name, i) => {
    lines.push(
      `INSERT INTO public.project_squads (project_id, name, order_index) VALUES (${esc(p.id)}, ${esc(name)}, ${i});`,
    );
  });

  (p.trilha || []).forEach((title, i) => {
    lines.push(
      `INSERT INTO public.trilha_items (project_id, title, order_index) VALUES (${esc(p.id)}, ${esc(title)}, ${i});`,
    );
  });

  DOC_CATEGORY_ORDER.forEach((name, i) => {
    lines.push(
      `INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES (${esc(p.id)}, ${esc(name)}, ${esc(DOC_CATEGORY_ICONS[name])}, ${i});`,
    );
  });

  const docs = SEED_DOCS[p.id] || {};
  let docOrder = 0;
  for (const [category, items] of Object.entries(docs)) {
    for (const doc of items) {
      lines.push(
        `INSERT INTO public.documents (project_id, category_id, title, type, url, author)`,
      );
      lines.push(
        `SELECT ${esc(p.id)}, dc.id, ${esc(doc.title)}, ${esc(doc.type)}, ${esc(doc.url)}, ${esc(doc.author)}`,
      );
      lines.push(
        `FROM public.doc_categories dc WHERE dc.project_id = ${esc(p.id)} AND dc.name = ${esc(category)};`,
      );
      docOrder += 1;
    }
  }

  (p.glossario || []).forEach((g) => {
    lines.push(
      `INSERT INTO public.glossario (project_id, term, definition) VALUES (${esc(p.id)}, ${esc(g.term)}, ${esc(g.def)});`,
    );
  });

  (p.pessoas || []).forEach((person) => {
    lines.push(
      `INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES (${esc(p.id)}, ${esc(person.name)}, ${esc(person.role)}, ${esc(person.area)}, ${esc(person.contact)}, ${esc(person.specialty)});`,
    );
  });

  (p.stakeholders || []).forEach((s) => {
    lines.push(
      `INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES (${esc(p.id)}, ${esc(s.name)}, ${esc(s.role)}, ${esc(s.area)}, ${esc(s.contact)}, ${esc(s.influence)}, ${esc(s.interest)}, ${esc(s.expectativa)});`,
    );
  });

  (p.reunioes || []).forEach((r) => {
    lines.push(
      `INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES (${esc(p.id)}, ${esc(r.name)}, ${esc(r.descricao)}, ${esc(r.frequency)}, ${esc(r.duration)}, ${esc(r.time)}, ${arr(r.participants)}, ${esc(r.link)});`,
    );
  });

  if (p.faq) {
    let faqIdx = 0;
    for (const [category, items] of Object.entries(p.faq)) {
      for (const item of items) {
        lines.push(
          `INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES (${esc(p.id)}, ${esc(category)}, ${esc(item.q)}, ${esc(item.a)}, ${faqIdx++});`,
        );
      }
    }
  }

  const op = p.operacao || {};
  (op.alertas || []).forEach((a) => {
    lines.push(
      `INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES (${esc(p.id)}, ${esc(a.nome)}, ${esc(a.severidade)}, ${esc(a.significado)}, ${esc(a.acao)});`,
    );
  });

  (op.diagnostico || []).forEach((step, i) => {
    lines.push(
      `INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES (${esc(p.id)}, ${esc(step)}, ${i});`,
    );
  });

  (op.contatos || []).forEach((c, i) => {
    lines.push(
      `INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES (${esc(p.id)}, ${esc(c.problema)}, ${esc(c.responsavel)}, ${esc(c.canal)}, ${i});`,
    );
  });

  (op.logs || []).forEach((l, i) => {
    lines.push(
      `INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES (${esc(p.id)}, ${esc(l.sistema)}, ${esc(l.onde)}, ${esc(l.filtro)}, ${i});`,
    );
  });

  (op.canais || []).forEach((c, i) => {
    lines.push(
      `INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES (${esc(p.id)}, ${esc(c.nome)}, ${esc(c.plataforma)}, ${esc(c.descricao)}, ${i});`,
    );
  });

  lines.push('');
}

lines.push('COMMIT;');
lines.push('');

const output = lines.join('\n');
const outPath = join(__dirname, 'seed-normalized.sql');
writeFileSync(outPath, output, 'utf8');
console.log(`Gerado: ${outPath} (${output.length} bytes)`);
