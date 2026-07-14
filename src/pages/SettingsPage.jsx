import React, { useState } from 'react';

function SettingsPage() {
  const [notif, setNotif] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className="w-10 h-6 rounded-full relative transition-colors shrink-0" style={{ background: on ? "#0E7C66" : "#E4E7EC" }}>
      <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? 20 : 4 }} />
    </button>
  );
  return (
    <div className="max-w-lg flex flex-col gap-5">
      <h1 className="text-[19px] font-bold" style={{ color: "#14171F", fontFamily: "'Space Grotesk', sans-serif" }}>Configurações</h1>
      <div className="rounded-2xl divide-y" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
        <div className="flex items-center justify-between p-4"><div><p className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>Notificações no produto</p><p className="text-[12px]" style={{ color: "#5B6472" }}>Receba avisos sobre novos conteúdos e prazos.</p></div><Toggle on={notif} onClick={() => setNotif((v) => !v)} /></div>
        <div className="flex items-center justify-between p-4"><div><p className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>Resumo semanal por e-mail</p><p className="text-[12px]" style={{ color: "#5B6472" }}>Receba um resumo do seu progresso toda segunda-feira.</p></div><Toggle on={emailDigest} onClick={() => setEmailDigest((v) => !v)} /></div>
        <div className="flex items-center justify-between p-4"><div><p className="text-[13.5px] font-semibold" style={{ color: "#14171F" }}>Tema</p><p className="text-[12px]" style={{ color: "#5B6472" }}>Modo escuro chegando em breve.</p></div><span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#F7F8FA", color: "#9AA2B1" }}>Claro</span></div>
      </div>
    </div>
  );
}

export default SettingsPage;
