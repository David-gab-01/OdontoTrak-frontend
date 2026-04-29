import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Importe o seu hook

const WelcomeHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado do estado global

  console.log("Usuário", user); // Debug para verificar o conteúdo do user  

  // Opcional: Criar um fallback caso o user ainda não tenha carregado
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      {/* Lado Esquerdo: Saudação usando o 'sub' (e-mail) ou nome se tiver no token */}
      <h1 className="text-3xl font-bold text-dentista-title">
        Bem-vindo, {user.sub.split('@')[0]}! 
      </h1>

      {/* Lado Direito: Card de Perfil */}
      <div 
        onClick={() => navigate("/perfil-profissional")} // Navega para o perfil do profissional usando o ID do usuário
        className="flex items-center gap-5 bg-white p-4 md:p-6 rounded-clinica shadow-sm border border-gray-100 
                   self-start md:self-auto cursor-pointer hover:border-dentista-primary 
                   hover:shadow-md transition-all group"
      >
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center 
                        text-dentista-primary shrink-0 group-hover:bg-dentista-primary 
                        group-hover:text-white transition-colors">
          <UserRound size={24} />
        </div>
        <div>
          <p className="text-lg font-bold text-dentista-title leading-tight group-hover:text-dentista-primary transition-colors">
            {user.nome || "Profissional"} 
          </p>
          <p className="text-xs text-dentista-body opacity-60">
            {/* Aqui ele exibe o cargo que vem das roles do JWT */}
            {user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Cirurgião Dentista'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;