import React from 'react';
import { ListChecks, Trophy } from 'lucide-react';
import SummaryCard from '../components/ui/SummaryCard';

function pct(n, d) { if (!d) return 0; return Math.round((n / d) * 100); }

function ProfilePage({ userName, completed, projects }) {
  const totalDone = Object.values(completed).reduce((acc, arr) => acc + arr.length, 0);
  const totalItems = projects.reduce((acc, p) => acc + p.trilha.length, 0);
  return (
    <div className="max-w-lg flex flex-col gap-5">
      <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-[18px] font-bold text-white" style={{ background: "#0E7C66" }}>{userName.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <div><h1 className="text-[18px] font-bold" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>{userName}</h1><p className="text-[12.5px]" style={{ color: "#5B6472" }}>Novo(a) colaborador(a) · Engenharia</p></div>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <SummaryCard icon={ListChecks} label="Itens concluídos" value={totalDone} accent="#0E7C66" />
        <SummaryCard icon={Trophy} label="Itens no total" value={totalItems} accent="#6E3AAE" />
      </div>
    </div>
  );
}

export default ProfilePage;
