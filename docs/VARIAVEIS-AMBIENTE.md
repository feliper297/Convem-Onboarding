# Variáveis de ambiente e segurança

Este documento descreve como configurar secrets e chaves do Supabase no Portal de Onboarding sem expô-los no GitHub.

## Visão geral

| Arquivo        | Commitar no Git? | Descrição                                      |
|----------------|------------------|------------------------------------------------|
| `.env.example` | ✅ Sim           | Template sem valores reais — referência do time |
| `.env`         | ❌ **Nunca**     | Chaves reais — apenas na sua máquina / deploy  |
| `.gitignore`   | ✅ Sim           | Impede que `.env` seja enviado ao repositório |

## Setup local (primeira vez)

```bash
# Se o .env ainda não existir, copie o template
cp .env.example .env
```

O arquivo `.env` já pode vir pré-configurado no ambiente de desenvolvimento. Se recriar do zero, obtenha as chaves em:

**Supabase Dashboard** → seu projeto → **Project Settings** → **API**

## Variáveis disponíveis

Todas as variáveis expostas ao frontend **devem** usar o prefixo `VITE_` (requisito do Vite).

| Variável                         | Obrigatória | Uso                                      |
|----------------------------------|-------------|------------------------------------------|
| `VITE_SUPABASE_URL`              | Sim         | URL base da API do projeto Supabase      |
| `VITE_SUPABASE_ANON_KEY`         | Sim         | Chave pública `anon` (legacy JWT)        |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | Recomendada | Chave publishable (formato novo Supabase)|
| `VITE_APP_ENV`                   | Não         | `development`, `staging` ou `production` |

### Uso no código React

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

Após alterar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Regras de segurança

### ✅ Pode ir no frontend (`.env` com prefixo `VITE_`)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`

Essas chaves são **públicas por design** — a proteção real vem das políticas **RLS (Row Level Security)** no PostgreSQL.

### ❌ NUNCA colocar no frontend

- `service_role` key — bypassa RLS e dá acesso total ao banco
- Senhas de banco, tokens privados, API keys de terceiros
- Qualquer secret sem prefixo `VITE_` ainda pode vazar se importado no código cliente

> **Regra de ouro:** se a chave não pode aparecer no navegador do usuário, ela não pode estar em variáveis `VITE_*`.

## Deploy (Vercel / produção)

Configure as mesmas variáveis no painel do provedor:

1. **Vercel** → Project → **Settings** → **Environment Variables**
2. Adicione cada `VITE_*` com o valor de **produção**
3. Faça redeploy após salvar

Não faça upload do `.env` para o repositório — use sempre o painel do host.

## Checklist antes do commit

- [ ] `.env` está listado no `.gitignore`
- [ ] `git status` **não** mostra `.env`
- [ ] `.env.example` está atualizado (sem chaves reais)
- [ ] Nenhum `service_role` no código ou em variáveis `VITE_*`

```bash
# Verificar se .env está ignorado
git check-ignore -v .env
# Saída esperada: .gitignore:... .env
```

## Projeto Supabase conectado

| Campo        | Valor                                      |
|--------------|--------------------------------------------|
| Project ref  | `xxpqnaupvkhalkfdwuaw`                     |
| URL          | `https://xxpqnaupvkhalkfdwuaw.supabase.co` |

As chaves reais ficam apenas no `.env` local (gitignored) e nos painéis de deploy de produção.

## Storage (Supabase)

Antes de usar upload de fotos ou documentos, execute o script SQL no **Supabase Dashboard → SQL Editor**:

```
scripts/storage-setup.sql
```

Isso cria os buckets `avatars` e `documents` com políticas RLS.

| Bucket      | Uso                          | Limite |
|-------------|------------------------------|--------|
| `avatars`   | Foto de perfil do usuário    | 2 MB   |
| `documents` | Anexos na documentação       | 10 MB  |

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `import.meta.env.VITE_*` retorna `undefined` | Reinicie `npm run dev` após editar `.env` |
| Variável não aparece no build | Confirme o prefixo `VITE_` no nome |
| `.env` aparece no `git status` | Verifique se `.gitignore` contém `.env` |
| Erro de permissão no Supabase | Revise políticas RLS — não use `service_role` no client |
