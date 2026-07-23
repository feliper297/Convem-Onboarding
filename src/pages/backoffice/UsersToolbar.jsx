import React from 'react';

import { Search, X } from 'lucide-react';



function UsersToolbar({

  search,

  onSearch,

  roleFilter,

  onRoleFilter,

  projectFilter,

  onProjectFilter,

  statusFilter,

  onStatusFilter,

  projects,

}) {

  return (

    <div className="flex items-center gap-3 flex-wrap">

      <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3 py-2 rounded-md bg-surface border border-border">

        <Search size={14} className="text-ink-muted shrink-0" />

        <input

          value={search}

          onChange={(e) => onSearch(e.target.value)}

          placeholder="Buscar por nome ou e-mail…"

          className="flex-1 outline-none text-[13px] bg-transparent text-ink-primary placeholder:text-ink-muted"

        />

        {search && (

          <button type="button" onClick={() => onSearch('')} className="text-ink-faint hover:text-ink-muted">

            <X size={13} />

          </button>

        )}

      </div>



      <select value={roleFilter} onChange={(e) => onRoleFilter(e.target.value)} className="input shrink-0 w-auto">

        <option value="all">Todas as roles</option>

        <option value="admin">Admin</option>

        <option value="gestor">Gestor</option>

        <option value="colaborador">Colaborador</option>

      </select>



      <select value={projectFilter} onChange={(e) => onProjectFilter(e.target.value)} className="input shrink-0 w-auto">

        <option value="all">Todos os projetos</option>

        {projects.map((p) => (

          <option key={p.id} value={p.id}>

            {p.name}

          </option>

        ))}

      </select>



      <select value={statusFilter} onChange={(e) => onStatusFilter(e.target.value)} className="input shrink-0 w-auto">

        <option value="all">Todos os status</option>

        <option value="active">Ativo</option>

        <option value="inactive">Inativo</option>

      </select>

    </div>

  );

}



export default UsersToolbar;

