-- Cadastro: vínculo automático ao projeto pelo nome informado
-- Execute no Supabase Dashboard → SQL Editor

CREATE OR REPLACE FUNCTION public.resolve_project_id_by_name(p_name text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id
  FROM public.projects p
  WHERE p.active = true
    AND lower(trim(p.name)) = lower(trim(p_name))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.resolve_project_id_by_name(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_project_id_by_name(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  selected_project_name text;
  matched_project_id text;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador')
  );

  selected_project_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'project_name'), '');

  IF selected_project_name IS NOT NULL THEN
    SELECT p.id
    INTO matched_project_id
    FROM public.projects p
    WHERE p.active = true
      AND lower(trim(p.name)) = lower(trim(selected_project_name))
    LIMIT 1;

    IF matched_project_id IS NOT NULL THEN
      INSERT INTO public.user_projects (user_id, project_id)
      VALUES (NEW.id, matched_project_id)
      ON CONFLICT (user_id, project_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;
