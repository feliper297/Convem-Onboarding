import React from 'react';
import { ListChecks, Trophy } from 'lucide-react';
import SummaryCard from '../components/ui/SummaryCard';
import UserAvatar from '../components/ui/UserAvatar';

function ProfilePage({ userName, profile, completed, projects }) {
  const totalDone = Object.values(completed).reduce((acc, arr) => acc + arr.length, 0);
  const totalItems = projects.reduce((acc, p) => acc + p.trilha.length, 0);

  const statusLabel = profile?.isNewCollaborator ? 'Novo(a) colaborador(a)' : 'Colaborador(a)';
  const cargoLabel = profile?.cargo?.trim();
  const subtitle = [statusLabel, cargoLabel].filter(Boolean).join(' · ');

  return (
    <div className="max-w-lg flex flex-col gap-4">
      <div className="card-padded-lg flex items-center gap-4">
        <UserAvatar name={userName} avatarUrl={profile?.avatarUrl} size="lg" />
        <div>
          <h1 className="text-lg font-semibold text-ink-primary">{userName}</h1>
          {subtitle && <p className="text-xs text-ink-secondary mt-0.5">{subtitle}</p>}
          {profile?.email && <p className="text-xs text-ink-muted mt-1">{profile.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon={ListChecks} label="Itens concluídos" value={totalDone} />
        <SummaryCard icon={Trophy} label="Itens no total" value={totalItems} />
      </div>
    </div>
  );
}

export default ProfilePage;
