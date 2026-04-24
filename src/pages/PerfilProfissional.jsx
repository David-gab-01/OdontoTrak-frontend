import React from 'react';
import { useAuth } from "../contexts/AuthContext"; 
import { LogOut, User, Mail, Shield } from "lucide-react"; 
import Button from "../components/Button"; // Importando o seu componente

const PerfilProfissional = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Deseja realmente encerrar sua sessão?")) {
      logout();
    }
  };

  return (
    <div className="p-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">Meu Perfil</h1>
        <p className="text-dentista-body opacity-70">Gerencie suas informações e sessão.</p>
      </header>

      <div className="bg-white rounded-clinica shadow-sm border border-gray-100 overflow-hidden">
        {/* Cabeçalho do Card */}
        <div className="bg-dentista-primary/5 p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-dentista-primary shadow-sm">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dentista-title">
              {user?.sub?.split('@')[0].toUpperCase()}
            </h2>

          </div>
        </div>

        {/* Detalhes */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-dentista-body">
            <Mail size={18} className="opacity-50" />
            <span><span className="font-semibold">E-mail:</span> {user?.sub}</span>
          </div>
          <div className="flex items-center gap-3 text-dentista-body">
            <Shield size={18} className="opacity-50" />
            <span><span className="font-semibold">Nível de Acesso:</span> Administrador</span>
          </div>
        </div>

        {/* Rodapé do Card com o SEU Botão */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button 
            onClick={handleLogout}
            variant="danger" // Assumindo que seu componente Button tenha essa variante, ou use a que preferir
            className="w-full md:w-auto"
            icon={LogOut}
          >
            Encerrar Sessão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerfilProfissional;
