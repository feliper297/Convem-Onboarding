# Editar e Excluir Projeto — Design

## Contexto

O portal permite criar projetos (`NewProjectModal.jsx` → `persistProject()` em `projectService.js`), mas não há como editar ou excluir um projeto já criado depois disso. O usuário precisa desses dois botões, funcionais ponta a ponta (UI + Supabase), disponíveis para qualquer usuário autenticado (a política RLS `Autenticados gerenciam projects` já cobre `ALL` sem restrição de dono, então nenhuma mudança de RLS é necessária).

Confirmado no banco (`hzyppudlqamalfguhecn`, tabela `projects`):
- RLS: `Autenticados gerenciam projects` (cmd `ALL`, `qual: true`, `with_check: true`) — qualquer usuário autenticado pode `UPDATE`/`DELETE`.
- Todas as tabelas filhas (`glossario`, `team_members`, `stakeholders`, `reunioes`, `faq`, `operacao_*`, `documents`, `doc_categories`, `trilha_items`, `project_links`, `project_technologies`, `project_squads`, `project_objectives`, `project_metrics`) têm FK com `ON DELETE CASCADE` para `projects`.

Decisões já validadas com o usuário:
- Exclusão é **definitiva (hard delete)**, não soft delete.
- Confirmação de exclusão exige **digitar o nome exato do projeto**.

## Escopo

Dentro do escopo:
- Botões de editar (lápis) e excluir (lixeira) no cabeçalho de `ProjectPage.jsx`, ao lado do nome/tagline do projeto.
- Modal de edição reaproveitando o formulário de criação (nome, descrição, responsável, e-mail do responsável, ícone, cor).
- Modal de exclusão com campo de confirmação por nome.
- Persistência real no Supabase para ambas as ações, refletida no estado local do app.

Fora do escopo:
- Edição de responsável/e-mail não deve alterar a linha de `team_members` já existente (mesmo comportamento da criação, que só grava o líder inicial).
- Soft delete / restauração de projeto excluído.
- Restrição por dono/criador do projeto (não existe esse conceito hoje; qualquer autenticado pode editar/excluir qualquer projeto, replicando o que já vale para todas as outras entidades do app).

## Arquitetura

### 1. `ProjectFormModal.jsx` (renomeado de `NewProjectModal.jsx`)

- Novo prop opcional `project`. Quando presente:
  - Título: "Editar Projeto"; botão principal: "Salvar Alterações".
  - Formulário pré-preenchido a partir do `project`:
    - `name` ← `project.name`
    - `description` ← `project.description`
    - `techLead` ← `project.team.lead`
    - `techLeadEmail` ← `project.contacts?.[0]?.contact || ''`
    - `iconId` ← `PROJECT_ICONS.find(i => i.icon === project.icon)?.id || PROJECT_ICONS[0].id`
    - `colorIndex` ← índice em `PROJECT_COLORS` cujo `color` bate com `project.color` (fallback `0`)
  - `onSave` recebe os mesmos campos de hoje; o chamador (`App.jsx`) decide se é criação ou atualização.
- Quando `project` é `undefined` (uso atual): comportamento idêntico ao `NewProjectModal` de hoje.
- Único consumidor é `App.jsx` — rename seguro, um único import a ajustar.

### 2. `DeleteProjectModal.jsx` (novo, em `src/components/projects/`)

- Props: `project`, `onConfirm`, `onClose`, `deleting` (bool, para desabilitar botão durante a chamada).
- Mostra aviso: "Esta ação é permanente e vai remover todo o conteúdo deste projeto (glossário, documentação, reuniões, stakeholders, operação e FAQ). Não pode ser desfeita."
- Campo de texto: usuário digita o nome exato do projeto (`project.name`). Botão "Excluir definitivamente" só habilita quando o texto digitado bate exatamente (case-sensitive, sem trim adicional além do já natural).
- Segue o padrão visual dos outros modais (`CrudModal`/`ConfirmDeleteModal` em `components/crud/index.jsx`), mas é um componente próprio pois o `ConfirmDeleteModal` genérico não tem esse campo de confirmação por nome.

### 3. `ProjectPage.jsx` — cabeçalho

- Recebe dois novos props: `onEdit` e `onDelete` (funções, chamadas com o `project` atual).
- Ao lado do bloco nome/tagline (mesma linha, `justify-between` já existente no header), adiciona dois botões-ícone (`Pencil`, `Trash2` do `lucide-react`), estilo consistente com `RowActions`/`CardActions` já usados em outras telas (`components/crud/index.jsx`).

### 4. `projectService.js` — novas funções

```js
export async function updateProject(id, { name, description, techLead, techLeadEmail, icon, color, soft }) {
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

- `updateProject` reaproveita `fetchProjectById` (já existe) para devolver o projeto montado por completo, igual ao que `persistProject` já faz hoje.
- `deleteProject` não precisa lidar com as tabelas filhas — cascade cuida disso (confirmado).

### 5. `App.jsx` — orquestração

- Novo estado: `editingProject` (`null` | objeto do projeto) e `deletingProject` (`null` | objeto do projeto).
- `handleEditProject(data)`:
  - Chama `updateProject(editingProject.id, data)`.
  - Sucesso: substitui o projeto no array `projects` pelo retorno, fecha modal, toast de sucesso.
  - Erro: mesmo padrão de `handleCreateProject` (detecta substring de RLS na mensagem, senão mensagem genérica), modal permanece aberto para nova tentativa.
- `handleDeleteProject()`:
  - Chama `deleteProject(deletingProject.id)`.
  - Sucesso: remove do array `projects`; se `route.projectId === deletingProject.id`, `setRoute({ view: 'dashboard' })`; fecha modal; toast de sucesso.
  - Erro: toast de erro, modal permanece aberto (não remove otimisticamente antes da confirmação do backend).
- `ProjectPage` passa a receber `onEdit={() => setEditingProject(currentProject)}` e `onDelete={() => setDeletingProject(currentProject)}`.
- Renderização condicional dos dois modais no final do JSX de `App.jsx`, ao lado de onde `NewProjectModal`/`ProjectFormModal` já é renderizado hoje.

## Fluxo de dados

**Editar:** clique no lápis → modal pré-preenchido → salvar → `updateProject` (UPDATE no Supabase) → refetch do projeto → substitui no estado `projects` → toast de sucesso. Erros tratados e exibidos via toast, modal não fecha.

**Excluir:** clique na lixeira → modal pede nome exato → digitou certo → botão habilita → confirma → `deleteProject` (DELETE cascata no Supabase) → só então remove do estado local `projects` → se estava na página desse projeto, navega para o Dashboard → toast de sucesso.

## Tratamento de erros

- Mesma heurística de mensagens já usada em `handleCreateProject` (`err.message?.includes('row-level security')` → mensagem de permissão; senão mensagem genérica com `err.message`).
- Nenhuma mudança otimista de estado antes da confirmação do backend, tanto para editar quanto para excluir — evita drift de UI se a operação falhar.

## Testes / verificação

- Rodar `npm run dev`, logar, editar a tagline/ícone/cor do projeto "APP Banking" pela UI e confirmar que o cabeçalho atualiza e a linha no Supabase reflete a mudança (`select * from projects where id = 'app-banking'`).
- Criar um projeto descartável via "Novo Projeto", excluí-lo pelo novo botão, confirmar que some da sidebar/dashboard e que a linha (e as tabelas filhas, se houver alguma) não existem mais no Supabase.
- Confirmar que digitar um nome incorreto no modal de exclusão mantém o botão de confirmação desabilitado.
