import React from 'react';

function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3.5" style={{ background: "#fff", border: "1px solid #E4E7EC" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + "1A" }}><Icon size={18} color={accent} /></div>
      <div>
        <p className="text-[20px] font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#14171F" }}>{value}</p>
        <p className="text-[12.5px] mt-1" style={{ color: "#5B6472" }}>{label}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
