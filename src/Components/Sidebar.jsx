import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarRange, BriefcaseMedical, UsersRound, ChartNoAxesCombined, ChartScatter} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Painel Geral", icon: <LayoutDashboard size={20} /> },
    { path: "/pacientes", label: "Pacientes", icon: <Users size={20} /> },
    { path: "/agenda ", label: "Agenda", icon: <CalendarRange size={20} /> },
    { path: "/consultas ", label: "Consultas", icon: <BriefcaseMedical size={20} /> },
    { path: "/profissionais ", label: "Profissionais", icon: <UsersRound  size={20} /> },
    { path: "/relatorio-financas ", label: "Relatórios Financeiros", icon: <ChartNoAxesCombined size={20} /> },
    { path: "/relatorio-consultas ", label: "Relatórios de Consultas", icon: <ChartScatter size={20} /> },
    
  ];

  return (
    <aside className="w-80 bg-dentista-sidebar border-r border-gray-200 flex flex-col">
      <div className="p-8 text-xl font-bold text-dentista-primary flex items-center gap-2">
        <div className="w-10 h-10 bg-dentista-primary rounded-lg"></div>
        OdontoTrack
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-colors ${
              location.pathname === item.path 
                ? "bg-white shadow-sm text-dentista-primary" 
                : "hover:bg-gray-200 text-dentista-body"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;