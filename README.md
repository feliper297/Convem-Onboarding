# Portal de Onboarding

Sistema completo de onboarding para novos colaboradores.

## Como rodar

```bash
npm install
cp .env.example .env   # se o .env ainda não existir
npm run dev
```

Abra http://localhost:5173 no navegador.

> **Variáveis de ambiente:** o `.env` contém as chaves do Supabase e **não** vai para o Git. Veja [docs/VARIAVEIS-AMBIENTE.md](docs/VARIAVEIS-AMBIENTE.md).

## Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Lucide React Icons
- Supabase (variáveis via `.env`)

## Estrutura

```
src/
├── data/              # Dados dos projetos, seed docs e navegação
├── hooks/             # useToasts
├── components/
│   ├── layout/        # Sidebar, Header, GlobalSearch
│   ├── ui/            # ProgressBar, EmptyState, Tooltip, etc.
│   └── crud/          # CrudModal, CrudToolbar, RowActions, etc.
└── pages/
    ├── Dashboard.jsx
    ├── SettingsPage.jsx
    ├── ProfilePage.jsx
    └── project/
        ├── ProjectPage.jsx
        ├── docs/      # DocumentaçãoUI (DocModal, ProjectDocs, etc.)
        └── tabs/      # Todas as abas do projeto
```
