import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, FileText, Calendar } from "lucide-react";

const ActionButton = ({ onClick, icon: Icon, label, bgColor, hoverColor }) => (
  <button
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-clinica shadow-sm border border-gray-100 hover:border-dentista-primary hover:text-dentista-primary transition-all group"
  >
    <div className={`p-3 ${bgColor} rounded-full group-hover:${hoverColor} group-hover:text-white transition-colors`}>
      <Icon size={28} />
    </div>
    <span className="text-lg font-bold">{label}</span>
  </button>
);

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <ActionButton 
        onClick={() => navigate("/novo-paciente")} 
        icon={UserPlus} 
        label="Novo Paciente" 
        bgColor="bg-blue-50" 
        hoverColor="bg-dentista-primary" 
      />
      <ActionButton 
        onClick={() => navigate("/nova-consulta")} 
        icon={FileText} 
        label="Nova Consulta" 
        bgColor="bg-cyan-50" 
        hoverColor="bg-dentista-secondary" 
      />
      <ActionButton 
        onClick={() => navigate("/agenda")} 
        icon={Calendar} 
        label="Visualizar Agenda" 
        bgColor="bg-orange-50" 
        hoverColor="bg-dentista-accent" 
      />
    </div>
  );
};

export default QuickActions;