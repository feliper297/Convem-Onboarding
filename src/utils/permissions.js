export function canManageBackOffice(profile) {
  return profile?.role === 'admin' || profile?.role === 'gestor';
}
