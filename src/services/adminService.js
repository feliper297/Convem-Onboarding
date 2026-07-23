import { supabase } from '../lib/supabase';

export async function fetchAdminUsers() {
  const [profilesRes, assignmentsRes, signInsRes, progressRes, trilhaRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, role, cargo, is_new_collaborator, is_active, avatar_url, created_at')
      .order('full_name'),
    supabase.from('user_projects').select('user_id, project_id'),
    supabase.rpc('admin_get_user_sign_ins'),
    supabase.from('trilha_progresso').select('user_id, project_id, completed_at'),
    supabase.from('trilha_items').select('project_id'),
  ]);

  if (profilesRes.error) throw profilesRes.error;
  if (assignmentsRes.error) throw assignmentsRes.error;
  if (signInsRes.error) throw signInsRes.error;
  if (progressRes.error) throw progressRes.error;
  if (trilhaRes.error) throw trilhaRes.error;

  const signInMap = {};
  (signInsRes.data || []).forEach((row) => {
    signInMap[row.user_id] = row.last_sign_in_at;
  });

  const assignmentsMap = {};
  (assignmentsRes.data || []).forEach((row) => {
    if (!assignmentsMap[row.user_id]) assignmentsMap[row.user_id] = [];
    assignmentsMap[row.user_id].push(row.project_id);
  });

  const trilhaCounts = {};
  (trilhaRes.data || []).forEach((row) => {
    trilhaCounts[row.project_id] = (trilhaCounts[row.project_id] || 0) + 1;
  });

  const progressByUserProject = {};
  (progressRes.data || []).forEach((row) => {
    const key = `${row.user_id}:${row.project_id}`;
    if (!progressByUserProject[key]) {
      progressByUserProject[key] = { user_id: row.user_id, project_id: row.project_id, completed_items: 0, completed_at: row.completed_at };
    }
    progressByUserProject[key].completed_items += 1;
    if (row.completed_at && (!progressByUserProject[key].completed_at || new Date(row.completed_at) > new Date(progressByUserProject[key].completed_at))) {
      progressByUserProject[key].completed_at = row.completed_at;
    }
  });

  const progressRows = Object.values(progressByUserProject).map((row) => ({
    ...row,
    total_items: trilhaCounts[row.project_id] || 0,
  }));

  const users = (profilesRes.data || []).map((p) => ({
    id: p.id,
    email: p.email || '',
    fullName: p.full_name || '',
    role: p.role || 'colaborador',
    cargo: p.cargo || '',
    isNewCollaborator: p.is_new_collaborator ?? true,
    isActive: p.is_active ?? true,
    avatarUrl: p.avatar_url,
    createdAt: p.created_at,
    projectIds: assignmentsMap[p.id] || [],
    lastSignInAt: signInMap[p.id] || null,
  }));

  return { users, progressRows, trilhaCounts };
}

export async function updateUserRole(userId, role) {
  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateUserActive(userId, isActive) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateUserProjects(userId, projectIds) {
  const { error: deleteError } = await supabase
    .from('user_projects')
    .delete()
    .eq('user_id', userId);
  if (deleteError) throw deleteError;

  if (!projectIds.length) return;

  const { error: insertError } = await supabase
    .from('user_projects')
    .insert(projectIds.map((projectId) => ({ user_id: userId, project_id: projectId })));
  if (insertError) throw insertError;
}

export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`,
  });
  if (error) throw error;
}
