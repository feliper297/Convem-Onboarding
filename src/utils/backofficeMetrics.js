const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000;

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function userOverallProgress(userId, progressRows, trilhaCounts) {
  const userRows = progressRows.filter((r) => r.user_id === userId);
  if (!userRows.length) return 0;

  let totalPct = 0;
  let count = 0;
  userRows.forEach((row) => {
    const total = trilhaCounts[row.project_id] || row.total_items || 0;
    if (total > 0) {
      totalPct += (Number(row.completed_items || 0) / total) * 100;
      count += 1;
    }
  });
  return count ? Math.round(totalPct / count) : 0;
}

function usersCompletedAtLeastOne(progressRows, trilhaCounts) {
  const byUser = {};
  progressRows.forEach((row) => {
    const total = trilhaCounts[row.project_id] || row.total_items || 0;
    if (total > 0 && Number(row.completed_items || 0) >= total) {
      byUser[row.user_id] = true;
    }
  });
  return Object.keys(byUser).length;
}

export function computeBackofficeKpis(users, progressRows, trilhaCounts, referenceDate = new Date()) {
  const cutoff = new Date(referenceDate.getTime() - MS_30_DAYS);

  const totalUsers = users.length;
  const usersBeforeCutoff = users.filter((u) => new Date(u.created_at) <= cutoff);
  const totalUsersPrev = usersBeforeCutoff.length;

  const inOnboarding = users.filter((u) => u.is_new_collaborator).length;
  const inOnboardingPrev = usersBeforeCutoff.filter((u) => u.is_new_collaborator).length;

  const completedOne = usersCompletedAtLeastOne(progressRows, trilhaCounts);

  const progressBeforeCutoff = progressRows.filter(
    (r) => !r.completed_at || new Date(r.completed_at) <= cutoff,
  );
  const completedOnePrev = usersCompletedAtLeastOne(progressBeforeCutoff, trilhaCounts);

  const avgCompletion = users.length
    ? Math.round(
        users.reduce((acc, u) => acc + userOverallProgress(u.id, progressRows, trilhaCounts), 0)
        / users.length,
      )
    : 0;

  const avgCompletionPrev = usersBeforeCutoff.length
    ? Math.round(
        usersBeforeCutoff.reduce(
          (acc, u) => acc + userOverallProgress(u.id, progressBeforeCutoff, trilhaCounts),
          0,
        ) / usersBeforeCutoff.length,
      )
    : 0;

  return [
    {
      id: 'total-users',
      label: 'Usuários total',
      value: totalUsers,
      change: pctChange(totalUsers, totalUsersPrev),
    },
    {
      id: 'onboarding',
      label: 'Em onboarding',
      value: inOnboarding,
      change: pctChange(inOnboarding, inOnboardingPrev),
    },
    {
      id: 'completed-one',
      label: 'Concluíram ≥1 projeto',
      value: completedOne,
      change: pctChange(completedOne, completedOnePrev),
    },
    {
      id: 'avg-completion',
      label: 'Conclusão média',
      value: `${avgCompletion}%`,
      change: pctChange(avgCompletion, avgCompletionPrev),
    },
  ];
}
