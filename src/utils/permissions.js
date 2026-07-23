export function canManageBackOffice(profile) {
  return profile?.role === 'admin' || profile?.role === 'gestor';
}

export function canManageProjectContent(profile, projectId, assignedProjectIds = []) {
  if (canManageBackOffice(profile)) return true;
  return assignedProjectIds.includes(projectId);
}
