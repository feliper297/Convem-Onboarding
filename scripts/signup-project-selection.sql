-- Cadastro: listagem pública de projetos e vínculo automático ao criar conta
-- Execute no Supabase Dashboard → SQL Editor

CREATE OR REPLACE FUNCTION public.list_active_projects_for_signup()
RETURNS TABLE(id text, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.name
  FROM public.projects p
  WHERE p.active = true
  ORDER BY p.name;
$$;

REVOKE ALL ON FUNCTION public.list_active_projects_for_signup() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_active_projects_for_signup() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  selected_project_id text;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador')
  );

  selected_project_id := NULLIF(TRIM(NEW.raw_user_meta_data->>'project_id'), '');

  IF selected_project_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.projects WHERE id = selected_project_id AND active = true
  ) THEN
    INSERT INTO public.user_projects (user_id, project_id)
    VALUES (NEW.id, selected_project_id)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;
