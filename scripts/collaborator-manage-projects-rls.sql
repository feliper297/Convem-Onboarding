-- Permite colaboradores autenticados gerenciar projetos (editar/excluir)
-- Alinha RLS com a UI: botões visíveis para todos os perfis logados.

CREATE OR REPLACE FUNCTION public.can_manage_project_structure(p_project_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.can_read_project(p_project_id);
$$;

DROP POLICY IF EXISTS "Admin e gestor gerenciam projects" ON public.projects;

CREATE POLICY "Autenticados gerenciam projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.can_read_project(id))
  WITH CHECK (public.can_read_project(id));
