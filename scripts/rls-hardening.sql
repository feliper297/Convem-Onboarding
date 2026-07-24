-- RLS hardening — Portal de Onboarding
-- Execute no Supabase Dashboard → SQL Editor (ou via migration)
--
-- Modelo de permissões:
--   admin / gestor  → leitura e escrita em todos os projetos
--   colaborador     → leitura de todos os projetos autenticados
--                     escrita apenas nos projetos atribuídos (user_projects)

-- ─── Funções auxiliares ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_assigned_to_project(p_project_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_projects
    WHERE user_id = auth.uid()
      AND project_id = p_project_id
  );
$$;

CREATE OR REPLACE FUNCTION public.can_read_project(p_project_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_project_structure(p_project_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.can_read_project(p_project_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_project_content(p_project_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_admin_or_gestor()
      OR public.is_assigned_to_project(p_project_id);
$$;

CREATE OR REPLACE FUNCTION public.storage_documents_project_id(object_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT split_part(object_name, '/', 1);
$$;

-- ─── projects ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Autenticados criam projects" ON public.projects;
DROP POLICY IF EXISTS "Autenticados leem projects" ON public.projects;

CREATE POLICY "Autenticados leem projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (public.can_read_project(id));

DROP POLICY IF EXISTS "Admin e gestor gerenciam projects" ON public.projects;

CREATE POLICY "Autenticados gerenciam projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.can_read_project(id))
  WITH CHECK (public.can_read_project(id));

-- ─── Tabelas de estrutura do projeto (autenticados gerenciam) ────────────────

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'project_objectives',
    'project_metrics',
    'project_links',
    'project_technologies',
    'project_squads',
    'trilha_items',
    'doc_categories'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Autenticados gerenciam %I" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Autenticados leem %I" ON public.%I', tbl, tbl);

    EXECUTE format(
      'CREATE POLICY "Autenticados leem %I" ON public.%I FOR SELECT TO authenticated USING (public.can_read_project(project_id))',
      tbl, tbl
    );

    EXECUTE format(
      'CREATE POLICY "Admin e gestor gerenciam %I" ON public.%I FOR ALL TO authenticated USING (public.can_manage_project_structure(project_id)) WITH CHECK (public.can_manage_project_structure(project_id))',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ─── Tabelas de conteúdo (admin/gestor ou colaborador atribuído) ─────────────

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'documents',
    'faq',
    'glossario',
    'team_members',
    'stakeholders',
    'reunioes',
    'operacao_alertas',
    'operacao_canais',
    'operacao_contatos',
    'operacao_diagnostico',
    'operacao_logs'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Autenticados gerenciam %I" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Autenticados leem %I" ON public.%I', tbl, tbl);

    EXECUTE format(
      'CREATE POLICY "Autenticados leem %I" ON public.%I FOR SELECT TO authenticated USING (public.can_read_project(project_id))',
      tbl, tbl
    );

    EXECUTE format(
      'CREATE POLICY "Gestão de conteúdo %I" ON public.%I FOR ALL TO authenticated USING (public.can_manage_project_content(project_id)) WITH CHECK (public.can_manage_project_content(project_id))',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ─── trilha_progresso ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Autenticados leem trilha_progresso" ON public.trilha_progresso;

-- ─── Storage: documents (upload/delete restrito por projeto) ─────────────────

DROP POLICY IF EXISTS "documents_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "documents_update_auth" ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_auth" ON storage.objects;

CREATE POLICY "documents_insert_assigned"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND public.can_manage_project_content(public.storage_documents_project_id(name))
  );

CREATE POLICY "documents_update_assigned"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.can_manage_project_content(public.storage_documents_project_id(name))
  );

CREATE POLICY "documents_delete_assigned"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND public.can_manage_project_content(public.storage_documents_project_id(name))
  );

-- ─── Revogar execução RPC anônima das funções auxiliares ─────────────────────

REVOKE ALL ON FUNCTION public.is_assigned_to_project(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_read_project(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_project_structure(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_project_content(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin_or_gestor() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_get_user_sign_ins() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_assigned_to_project(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_project(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_project_structure(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_project_content(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_gestor() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_user_sign_ins() TO authenticated;
