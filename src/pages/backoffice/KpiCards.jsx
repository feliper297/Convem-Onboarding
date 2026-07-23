import React from 'react';

import { Users, ClipboardList, CheckCircle2, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';



const ICONS = {

  'total-users': Users,

  onboarding: ClipboardList,

  'completed-one': CheckCircle2,

  'avg-completion': BarChart3,

};



function ChangeBadge({ change }) {

  const positive = change >= 0;

  return (

    <span

      className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded ${

        positive ? 'bg-brand-soft text-brand' : 'bg-danger-soft text-danger'

      }`}

    >

      {change >= 0 ? '+' : ''}

      {change}%

      {positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}

    </span>

  );

}



function KpiCards({ kpis }) {

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {kpis.map((kpi) => {

        const Icon = ICONS[kpi.id] || Users;

        return (

          <div key={kpi.id} className="card-padded flex flex-col gap-3">

            <div className="flex items-start justify-between gap-2">

              <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-surface-muted border border-border">

                <Icon size={17} className="text-ink-secondary" />

              </div>

              <ChangeBadge change={kpi.change} />

            </div>

            <div>

              <p className="kpi-value">{kpi.value}</p>

              <p className="kpi-label">{kpi.label}</p>

            </div>

          </div>

        );

      })}

    </div>

  );

}



export default KpiCards;

