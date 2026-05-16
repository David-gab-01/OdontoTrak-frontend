import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, CalendarRange, BriefcaseMedical, 
  UsersRound, ChartNoAxesCombined, ChartScatter, Lock 
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isDentista = user?.perfis?.includes('ROLE_DENTISTA');

  const menuItems = [
    // verifica se é dentista para direcionar ao dashboard correto
    { 
      path: isDentista ? "/dashboard-dentista" : "/dashboard", 
      label: "Painel Geral", 
      icon: <LayoutDashboard size={20} />, 
      roles: ['ROLE_ADMIN', 'ROLE_RECEPCIONISTA', 'ROLE_DENTISTA'] 
    },
    { path: "/pacientes", label: "Pacientes", icon: <Users size={20} />, roles: ['ROLE_ADMIN', 'ROLE_DENTISTA', 'ROLE_RECEPCIONISTA'] },
    { path: "/agenda", label: "Agenda", icon: <CalendarRange size={20} />, roles: ['ROLE_ADMIN', 'ROLE_DENTISTA', 'ROLE_RECEPCIONISTA'] },
    { path: "/consultas", label: "Consultas", icon: <BriefcaseMedical size={20} />, roles: ['ROLE_ADMIN', 'ROLE_DENTISTA', 'ROLE_RECEPCIONISTA'] },
    { path: "/profissionais", label: "Profissionais", icon: <UsersRound size={20} />, roles: ['ROLE_ADMIN'] },
    { path: "/relatorio-financas", label: "Financeiro", icon: <ChartNoAxesCombined size={20} />, roles: ['ROLE_ADMIN'] },
    { path: "/relatorio-consultas", label: "Relatórios", icon: <ChartScatter size={20} />, roles: ['ROLE_ADMIN'] },
  ];

  return (
    <aside className="w-80 bg-dentista-sidebar border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-8 text-xl font-bold text-dentista-primary flex items-center gap-2">
        <div className="w-10 h-10 bg-dentista-primary rounded-lg flex items-center justify-center text-white font-bold">
          OT
        </div>
        OdontoTrack
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const hasPermission = item.roles.some(role => user?.perfis?.includes(role));

          if (!hasPermission) {
            return (
              <div
                key={item.path}
                title="Acesso restrito ao administrador"
                className="flex items-center justify-between w-full p-3 rounded-lg font-medium text-gray-400 cursor-not-allowed opacity-60 bg-gray-100/50 select-none"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                <Lock size={14} className="text-gray-400" />
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-all ${
                location.pathname === item.path 
                  ? "bg-white shadow-sm text-dentista-primary border-l-4 border-dentista-primary" 
                  : "hover:bg-gray-200 text-dentista-body"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;