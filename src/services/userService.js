import { supabase } from '../lib/supabase';

export async function fetchTrilhaProgress(userId) {
  const { data, error } = await supabase
    .from('trilha_progresso')
    .select('project_id, trilha_item_id, completed_at')
    .eq('user_id', userId);
  if (error) throw error;

  const byProject = {};
  (data || []).forEach((row) => {
    if (!byProject[row.project_id]) byProject[row.project_id] = [];
    byProject[row.project_id].push(row.trilha_item_id);
  });
  return byProject;
}

export async function fetchTrilhaTimeline(userId) {
  const { data, error } = await supabase
    .from('trilha_progresso')
    .select('project_id, trilha_item_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data || [];
}

export async function toggleTrilhaProgress(userId, projectId, trilhaItemId) {
  const { data: existing } = await supabase
    .from('trilha_progresso')
    .select('id')
    .eq('user_id', userId)
    .eq('trilha_item_id', trilhaItemId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('trilha_progresso').delete().eq('id', existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase.from('trilha_progresso').insert({
    user_id: userId,
    project_id: projectId,
    trilha_item_id: trilhaItemId,
    completed_at: new Date().toISOString(),
  });
  if (error) throw error;
  return true;
}

export async function fetchUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('notifications_enabled, email_digest_enabled')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return {
    notificationsEnabled: data?.notifications_enabled ?? true,
    emailDigestEnabled: data?.email_digest_enabled ?? false,
  };
}

export async function saveUserSettings(userId, { notificationsEnabled, emailDigestEnabled }) {
  const { error } = await supabase.from('user_settings').upsert({
    user_id: userId,
    notifications_enabled: notificationsEnabled,
    email_digest_enabled: emailDigestEnabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function fetchUserProjectIds(userId) {
  const { data, error } = await supabase
    .from('user_projects')
    .select('project_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((row) => row.project_id);
}

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, full_name, role, cargo, is_new_collaborator, is_active, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;

  return {
    email: data?.email ?? '',
    fullName: data?.full_name ?? '',
    role: data?.role ?? 'colaborador',
    cargo: data?.cargo ?? '',
    isNewCollaborator: data?.is_new_collaborator ?? true,
    isActive: data?.is_active ?? true,
    avatarUrl: data?.avatar_url ?? null,
  };
}

export async function updateUserProfile(userId, { fullName, cargo, isNewCollaborator, avatarUrl }) {
  const updates = { updated_at: new Date().toISOString() };
  if (fullName !== undefined) updates.full_name = fullName.trim();
  if (cargo !== undefined) updates.cargo = cargo.trim() || null;
  if (isNewCollaborator !== undefined) updates.is_new_collaborator = isNewCollaborator;
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;

  if (fullName !== undefined) {
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
    });
    if (authError) throw authError;
  }
}

export async function changeUserPassword({ email, currentPassword, newPassword }) {
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (verifyError) {
    throw new Error('Senha atual incorreta.');
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
