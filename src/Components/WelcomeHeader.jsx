import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const WelcomeHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const getRoleLabel = (perfis) => {
    if (perfis?.includes('ROLE_ADMIN')) return 'Administrador';
    if (perfis?.includes('ROLE_RECEPCIONISTA')) return 'Recepção';
    return 'Cirurgião Dentista';
  };

  const formatarNomeCurto = (nome) => {
    if (!nome) return "Profissional";
    const partes = nome.split(' ');
    if (partes.length > 1) {
      return `${partes[0]} ${partes[1]}`; 
    }
    return partes[0];
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-3xl font-bold text-dentista-title">
          Olá, {user.nome?.split(' ')[0]}! 
        </h1>
        <p className="text-dentista-body opacity-70">Tenha um excelente dia de trabalho.</p>
      </div>

      <div 
        onClick={() => navigate(`/perfil-user/${user.id}`)}
        /* Adicionada a classe 'max-w-[280px]' para limitar o tamanho total do botão */
        className="flex items-center gap-4 bg-white p-4 rounded-clinica shadow-sm border border-gray-100 
                   self-start md:self-auto cursor-pointer hover:border-dentista-primary 
                   hover:shadow-md transition-all group max-w-[280px] w-full"
      >
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center 
                        text-dentista-primary shrink-0 group-hover:bg-dentista-primary 
                        group-hover:text-white transition-colors">
          <UserRound size={24} />
        </div>

        <div className="min-w-0">
          <p className="text-base font-bold text-dentista-title leading-tight group-hover:text-dentista-primary 
                        transition-colors truncate">
            {formatarNomeCurto(user.nome)}
          </p>
          <p className="text-[10px] font-semibold text-dentista-body opacity-60 uppercase tracking-wider truncate">
            {getRoleLabel(user.perfis)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;