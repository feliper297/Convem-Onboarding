# Editar e Excluir Projeto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar botões de editar e excluir projeto (funcionais ponta a ponta, UI + Supabase) ao lado do nome do projeto em `ProjectPage.jsx`, disponíveis para qualquer usuário autenticado.

**Architecture:** Reaproveita o modal de criação de projeto (renomeado para `ProjectFormModal.jsx`) em modo edição; adiciona um novo `DeleteProjectModal.jsx` com confirmação por nome digitado; adiciona `updateProject`/`deleteProject` em `projectService.js`; conecta tudo em `App.jsx`, que já mantém o estado local `projects` e os handlers equivalentes de criação.

**Tech Stack:** React 18 (sem TypeScript), Vite, Supabase JS client, Tailwind (classes utilitárias inline), lucide-react para ícones. Sem framework de testes de componente configurado no projeto (só Storybook) — verificação é feita via `vite build` (compila/type-checks JSX) + teste manual no navegador + consulta SQL direta no Supabase (mesmo padrão já usado nesta sessão).

---

## Referência rápida do estado atual

- `src/components/projects/NewProjectModal.jsx` — modal de criação, usado só em `src/App.jsx`.
- `src/services/projectService.js` — tem `getIconName(iconComponent)`, `fetchProjectById(id)`, `persistProject(data)`. Vamos adicionar `updateProject` e `deleteProject` ao final do arquivo, sem tocar no resto.
- `src/pages/project/ProjectPage.jsx` — cabeçalho do projeto nas linhas 96-105 (bloco `<div className="flex items-start ...sm:justify-between">`).
- `src/App.jsx` — já tem `handleCreateProject`, `projects` state, `refreshProject`, `push` (toast). Import atual: `import NewProjectModal from './components/projects/NewProjectModal';` e render em `{newProjectOpen && <NewProjectModal onSave={handleCreateProject} onClose={() => setNewProjectOpen(false)} />}`.
- RLS já permite `UPDATE`/`DELETE` para qualquer usuário autenticado na tabela `projects` (confirmado). Tabelas filhas têm `ON DELETE CASCADE` (confirmado). Nenhuma migração de banco é necessária.

---

### Task 1: Renomear e estender o modal de projeto para suportar edição

**Files:**
- Rename: `src/components/projects/NewProjectModal.jsx` → `src/components/projects/ProjectFormModal.jsx`
- Modify: `src/App.jsx:14` (import) e `src/App.jsx` (uso do componente, ver Task 5)

- [ ] **Step 1: Renomear o arquivo**

```bash
git mv src/components/projects/NewProjectModal.jsx src/components/projects/ProjectFormModal.jsx
```

- [ ] **Step 2: Reescrever o conteúdo do arquivo renomeado**

Substitua o conteúdo inteiro de `src/components/projects/ProjectFormModal.jsx` por:

```jsx
import React, { useState } from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import { Field, FInput, FTextarea } from '../crud';
import { PROJECT_COLORS, PROJECT_ICONS } from '../../data/projectDefaults';

const BRAND = { color: "#0E7C66", soft: "#E6F4F1" };

const EMPTY_FORM = {
  name: "",
  description: "",
  techLead: "",
  techLeadEmail: "",
  iconId: PROJECT_ICONS[0].id,
  colorIndex: 0,
};

function deriveFormFromProject(project) {
  const iconEntry = PROJECT_ICONS.find((i) => i.icon === project.icon);
  const colorIndex = PROJECT_COLORS.findIndex((c) => c.color === project.color);
  return {
    name: project.name || "",
    description: project.description || "",
    techLead: project.team?.lead || "",
    techLeadEmail: project.contacts?.[0]?.contact || "",
    iconId: iconEntry ? iconEntry.id : PROJECT_ICONS[0].id,
    colorIndex: colorIndex >= 0 ? colorIndex : 0,
  };
}

function ProjectFormModal({ project, onSave, onClose }) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState(() => (isEdit ? deriveFormFromProject(project) : EMPTY_FORM));
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return setError("Informe o nome do projeto.");
    if (!form.techLead.trim()) return setError("Informe o Responsável.");
    if (form.techLeadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.techLeadEmail)) {
      return setError("Informe um e-mail válido para o Responsável.");
    }

    const iconEntry = PROJECT_ICONS.find((i) => i.id === form.iconId) || PROJECT_ICONS[0];
    const colorEntry = PROJECT_COLORS[form.colorIndex] || PROJECT_COLORS[0];

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      techLead: form.techLead.trim(),
      techLeadEmail: form.techLeadEmail.trim(),
      icon: iconEntry.icon,
      color: colorEntry.color,
      soft: colorEntry.soft,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: "rgba(14,17,25,0.70)", zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0"
          style={{ borderBottom: "1px solid #E4E7EC", background: "#fff" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: BRAND.soft }}
            >
              {isEdit ? <Pencil size={14} color={BRAND.color} /> : <Plus size={14} color={BRAND.color} />}
            </span>
            <p className="text-[14px] font-bold" style={{ color: "#14171F" }}>
              {isEdit ? "Editar Projeto" : "Novo Projeto"}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "#9AA2B1" }} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <Field label="Nome do projeto" required>
            <FInput
              value={form.name}
              onChange={(v) => set("name", v)}
              placeholder="Ex: APP Banking"
            />
          </Field>

          <Field label="Descrição completa">
            <FTextarea
              value={form.description}
              onChange={(v) => set("description", v)}
              placeholder="Descreva o propósito e contexto do projeto…"
              rows={3}
            />
          </Field>

          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Responsável" required>
                <FInput
                  value={form.techLead}
                  onChange={(v) => set("techLead", v)}
                  placeholder="Ex: Marina Tassi"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="E-mail do Responsável">
                <FInput
                  value={form.techLeadEmail}
                  onChange={(v) => set("techLeadEmail", v)}
                  placeholder="marina.tassi@empresa.com"
                />
              </Field>
            </div>
          </div>

          <Field label="Ícone">
            <div className="grid grid-cols-5 gap-2">
              {PROJECT_ICONS.map(({ id, icon: Icon, label }) => {
                const selected = form.iconId === id;
                const accent = PROJECT_COLORS[form.colorIndex];
                return (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    onClick={() => set("iconId", id)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-lg transition-colors"
                    style={{
                      background: selected ? accent.soft : "#F7F8FA",
                      border: selected ? `2px solid ${accent.color}` : "2px solid #E4E7EC",
                    }}
                  >
                    <Icon size={18} color={selected ? accent.color : "#5B6472"} />
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Cor do projeto">
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map(({ color, soft, label }, idx) => {
                const selected = form.colorIndex === idx;
                return (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    onClick={() => set("colorIndex", idx)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{
                      background: selected ? soft : "#F7F8FA",
                      color: selected ? color : "#5B6472",
                      border: selected ? `2px solid ${color}` : "2px solid #E4E7EC",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          {error && (
            <p
              className="text-[12px] font-medium px-3 py-2 rounded-lg"
              style={{ background: "#FEF2F2", color: "#EF4444" }}
            >
              {error}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-2.5 px-6 py-4 sticky bottom-0"
          style={{ borderTop: "1px solid #E4E7EC", background: "#fff" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: "#F7F8FA", color: "#5B6472", border: "1px solid #E4E7EC" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: BRAND.color }}
          >
            {isEdit ? "Salvar Alterações" : "Criar Projeto"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectFormModal;
```

- [ ] **Step 3: Verificar que o arquivo antigo não existe mais e o novo está no lugar certo**

Run: `ls src/components/projects/`
Expected: aparecem `DeleteProjectModal.jsx` (ainda não, criado na Task 2) e `ProjectFormModal.jsx`; `NewProjectModal.jsx` não existe mais.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/ProjectFormModal.jsx
git commit -m "Rename NewProjectModal to ProjectFormModal and support edit mode"
```

---

### Task 2: Criar o modal de confirmação de exclusão

**Files:**
- Create: `src/components/projects/DeleteProjectModal.jsx`

- [ ] **Step 1: Criar o arquivo**

```jsx
import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

function DeleteProjectModal({ project, onConfirm, onClose, deleting }) {
  const [confirmText, setConfirmText] = useState('');
  const canConfirm = confirmText === project.name && !deleting;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'rgba(14,17,25,0.70)', zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E4E7EC' }}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2' }}>
              <Trash2 size={14} color="#EF4444" />
            </span>
            <p className="text-[14px] font-bold" style={{ color: '#14171F' }}>Excluir Projeto</p>
          </div>
          <button onClick={onClose} style={{ color: '#9AA2B1' }} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: '#FEF2F2' }}>
            <AlertTriangle size={16} color="#EF4444" className="shrink-0 mt-0.5" />
            <p className="text-[12.5px]" style={{ color: '#991B1B' }}>
              Esta ação é permanente e vai remover todo o conteúdo deste projeto (glossário,
              documentação, reuniões, stakeholders, operação e FAQ). Não pode ser desfeita.
            </p>
          </div>
          <p className="text-[13px]" style={{ color: '#14171F' }}>
            Para confirmar, digite <strong>{project.name}</strong> abaixo:
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={project.name}
            className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
            style={{ border: '1px solid #E4E7EC', color: '#14171F' }}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4" style={{ borderTop: '1px solid #E4E7EC' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold"
            style={{ background: '#F7F8FA', color: '#5B6472', border: '1px solid #E4E7EC' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: '#EF4444' }}
          >
            {deleting ? 'Excluindo…' : 'Excluir definitivamente'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProjectModal;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/projects/DeleteProjectModal.jsx
git commit -m "Add DeleteProjectModal with name-confirmation guard"
```

---

### Task 3: Adicionar `updateProject` e `deleteProject` em `projectService.js`

**Files:**
- Modify: `src/services/projectService.js` (adicionar ao final do arquivo, depois de `persistProject`)

- [ ] **Step 1: Adicionar as duas funções ao final do arquivo**

Abra `src/services/projectService.js` e adicione ao final (depois do fechamento de `persistProject`, que hoje termina em `return fetchProjectById(id);\n}`):

```js

export async function updateProject(id, {
  name,
  description,
  techLead,
  techLeadEmail,
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
  }).eq('id', id);

  if (error) throw error;

  return fetchProjectById(id);
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
```

Nota: `techLeadEmail` não é usado aqui de propósito — a edição não altera a linha de `team_members` já existente (mesmo escopo documentado no spec).

- [ ] **Step 2: Verificar que o arquivo compila**

Run: `npx vite build`
Expected: build termina com `✓ built in` sem erros (mesmo warning de chunk size >500kB já existente é esperado e não é regressão).

- [ ] **Step 3: Commit**

```bash
git add src/services/projectService.js
git commit -m "Add updateProject and deleteProject to projectService"
```

---

### Task 4: Adicionar botões de editar/excluir no cabeçalho de `ProjectPage.jsx`

**Files:**
- Modify: `src/pages/project/ProjectPage.jsx:1-4` (imports), `:23-32` (assinatura da função), `:96-105` (cabeçalho)

- [ ] **Step 1: Adicionar import dos ícones**

Em `src/pages/project/ProjectPage.jsx`, na linha 1, troque:

```jsx
import React, { useState, useEffect } from 'react';
```

por:

```jsx
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
```

- [ ] **Step 2: Adicionar `onEdit`/`onDelete` na assinatura do componente**

Troque:

```jsx
function ProjectPage({
  project,
  route,
  setRoute,
  completed,
  toggleTrilhaItem,
  pushToast,
  onRefreshProject,
  userId,
}) {
```

por:

```jsx
function ProjectPage({
  project,
  route,
  setRoute,
  completed,
  toggleTrilhaItem,
  pushToast,
  onRefreshProject,
  userId,
  onEdit,
  onDelete,
}) {
```

- [ ] **Step 3: Adicionar os botões no cabeçalho**

Troque o bloco do cabeçalho (dentro do `return`):

```jsx
      <div className="flex items-start sm:items-center gap-3.5 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={20} color={project.color} /></div>
          <div>
            <h1 className="text-[19px] font-bold" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h1>
            <p className="text-[12.5px]" style={{ color: '#5B6472' }}>{project.tagline}</p>
          </div>
        </div>
      </div>
```

por:

```jsx
      <div className="flex items-start sm:items-center gap-3.5 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: project.soft }}><Icon size={20} color={project.color} /></div>
          <div>
            <h1 className="text-[19px] font-bold" style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h1>
            <p className="text-[12.5px]" style={{ color: '#5B6472' }}>{project.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#9AA2B1' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = project.color; e.currentTarget.style.background = project.soft; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9AA2B1'; e.currentTarget.style.background = 'transparent'; }}
            aria-label="Editar projeto"
            title="Editar projeto"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#9AA2B1' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9AA2B1'; e.currentTarget.style.background = 'transparent'; }}
            aria-label="Excluir projeto"
            title="Excluir projeto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
```

- [ ] **Step 4: Verificar que o arquivo compila**

Run: `npx vite build`
Expected: build termina com `✓ built in` sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/pages/project/ProjectPage.jsx
git commit -m "Add edit/delete buttons to project header"
```

---

### Task 5: Conectar tudo em `App.jsx`

**Files:**
- Modify: `src/App.jsx:14` (import do modal), `src/App.jsx:17` (import do service), `src/App.jsx` (novo state, novos handlers, props do `ProjectPage`, render dos modais)

- [ ] **Step 1: Trocar o import do modal**

Troque:

```jsx
import NewProjectModal from './components/projects/NewProjectModal';
```

por:

```jsx
import ProjectFormModal from './components/projects/ProjectFormModal';
import DeleteProjectModal from './components/projects/DeleteProjectModal';
```

- [ ] **Step 2: Importar `updateProject` e `deleteProject`**

Troque:

```jsx
import { fetchProjects, fetchProjectById, persistProject } from './services/projectService';
```

por:

```jsx
import { fetchProjects, fetchProjectById, persistProject, updateProject, deleteProject } from './services/projectService';
```

- [ ] **Step 3: Adicionar novo state**

Logo abaixo de `const [newProjectOpen, setNewProjectOpen] = useState(false);`, adicione:

```jsx
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deletingInFlight, setDeletingInFlight] = useState(false);
```

- [ ] **Step 4: Adicionar os handlers**

Logo depois da função `handleCreateProject` (que termina com `};` antes de `const handleLogout = ...`), adicione:

```jsx
  const handleUpdateProject = async (data) => {
    try {
      const updated = await updateProject(editingProject.id, data);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
      push(`Projeto "${updated.name}" atualizado com sucesso`, 'success');
    } catch (err) {
      console.error('Erro ao atualizar projeto:', err);
      push(
        err.message?.includes('row-level security')
          ? 'Sem permissão para editar. Faça login novamente e tente outra vez.'
          : `Erro ao atualizar projeto: ${err.message || 'tente novamente.'}`,
        'default',
      );
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    setDeletingInFlight(true);
    try {
      await deleteProject(deletingProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      if (route.view === 'project' && route.projectId === deletingProject.id) {
        setRoute({ view: 'dashboard' });
      }
      push(`Projeto "${deletingProject.name}" excluído.`, 'success');
      setDeletingProject(null);
    } catch (err) {
      console.error('Erro ao excluir projeto:', err);
      push(
        err.message?.includes('row-level security')
          ? 'Sem permissão para excluir. Faça login novamente e tente outra vez.'
          : `Erro ao excluir projeto: ${err.message || 'tente novamente.'}`,
        'default',
      );
    } finally {
      setDeletingInFlight(false);
    }
  };
```

- [ ] **Step 5: Passar `onEdit`/`onDelete` para `ProjectPage`**

Troque:

```jsx
          {route.view === 'project' && currentProject && (
            <ProjectPage
              project={currentProject}
              route={route}
              setRoute={setRoute}
              completed={completed}
              toggleTrilhaItem={toggleTrilhaItem}
              pushToast={push}
              onRefreshProject={() => refreshProject(currentProject.id)}
              userId={userId}
            />
          )}
```

por:

```jsx
          {route.view === 'project' && currentProject && (
            <ProjectPage
              project={currentProject}
              route={route}
              setRoute={setRoute}
              completed={completed}
              toggleTrilhaItem={toggleTrilhaItem}
              pushToast={push}
              onRefreshProject={() => refreshProject(currentProject.id)}
              userId={userId}
              onEdit={() => setEditingProject(currentProject)}
              onDelete={() => setDeletingProject(currentProject)}
            />
          )}
```

- [ ] **Step 6: Trocar o render do modal de criação e adicionar os dois novos modais**

Troque:

```jsx
      {newProjectOpen && <NewProjectModal onSave={handleCreateProject} onClose={() => setNewProjectOpen(false)} />}
```

por:

```jsx
      {newProjectOpen && <ProjectFormModal onSave={handleCreateProject} onClose={() => setNewProjectOpen(false)} />}
      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          onSave={handleUpdateProject}
          onClose={() => setEditingProject(null)}
        />
      )}
      {deletingProject && (
        <DeleteProjectModal
          project={deletingProject}
          deleting={deletingInFlight}
          onConfirm={handleDeleteProject}
          onClose={() => setDeletingProject(null)}
        />
      )}
```

- [ ] **Step 7: Verificar que o arquivo compila**

Run: `npx vite build`
Expected: build termina com `✓ built in` sem erros.

- [ ] **Step 8: Commit**

```bash
git add src/App.jsx
git commit -m "Wire up edit/delete project handlers in App.jsx"
```

---

### Task 6: Verificação manual ponta a ponta

**Files:** nenhum (só verificação)

- [ ] **Step 1: Subir o dev server**

Run: `npm run dev`
Expected: Vite sobe em alguma porta local (ex: `http://localhost:5173` ou próxima livre).

- [ ] **Step 2: Testar edição no navegador**

1. Fazer login com o usuário de teste (`testonboarding@gmail.com` / `testuser123`).
2. Abrir o projeto "APP Banking".
3. Clicar no ícone de lápis ao lado do nome.
4. Alterar a descrição/tagline e salvar.
5. Confirmar que o cabeçalho atualiza imediatamente e aparece o toast de sucesso.

- [ ] **Step 3: Confirmar a mudança no banco via SQL**

Usar a ferramenta MCP do Supabase (`mcp__claude_ai_Supabase__execute_sql`, `project_id: hzyppudlqamalfguhecn`):

```sql
select id, name, tagline, description from projects where id = 'app-banking';
```

Expected: `tagline`/`description` refletem o texto editado no passo anterior.

- [ ] **Step 4: Testar exclusão no navegador**

1. Criar um projeto descartável via "Novo Projeto" (ex: nome "Descartar Teste").
2. Abrir esse projeto e clicar no ícone de lixeira.
3. Digitar um nome errado no campo de confirmação e confirmar que o botão "Excluir definitivamente" continua desabilitado.
4. Digitar o nome exato ("Descartar Teste") e clicar em "Excluir definitivamente".
5. Confirmar que o app navega de volta para o Dashboard, o projeto some da sidebar, e aparece o toast de sucesso.

- [ ] **Step 5: Confirmar a exclusão no banco via SQL**

```sql
select id from projects where name = 'Descartar Teste';
```

Expected: nenhuma linha retornada.

- [ ] **Step 6: Parar o dev server**

Encerrar o processo do `npm run dev` iniciado no Step 1.

---

## Self-review notes

- **Cobertura do spec:** modal de edição reaproveitado (✅ arquitetura #1), modal de exclusão com confirmação por nome (✅ #2), botões no cabeçalho (✅ #3), `updateProject`/`deleteProject` (✅ #4), orquestração em `App.jsx` com os dois novos states e handlers (✅ #5), fluxo de dados e tratamento de erro seguindo o padrão de `handleCreateProject` (✅), verificação manual + SQL (✅ Task 6).
- **Placeholders:** nenhum "TBD"/"depois eu vejo" — todo código de cada step está completo.
- **Consistência de nomes:** `ProjectFormModal` (arquivo e export) usado de forma consistente nas Tasks 1 e 5; `updateProject`/`deleteProject` com a mesma assinatura entre Task 3 (definição) e Task 5 (uso); `editingProject`/`deletingProject`/`deletingInFlight` usados de forma consistente entre Task 5 steps 3, 4, 5 e 6.
