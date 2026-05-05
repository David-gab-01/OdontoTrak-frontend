import React from 'react';
import { useAuth } from "../contexts/AuthContext"; 
import { LogOut, Mail, Shield } from "lucide-react"; 
import Button from "../components/Button";
import ProfileHeader from "../components/ProfileHeader";

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

      <ProfileHeader
        title={user?.sub?.split('@')[0].toUpperCase()}
        subtitle="Meu Perfil"
        avatarText={user?.sub?.charAt(0).toUpperCase() || 'P'}
        fields={[
          { label: 'E-mail', value: user?.sub },
          { label: 'Nível de acesso', value: 'Administrador' },
        ]}
        actions={
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full md:w-auto"
            icon={LogOut}
          >
            Encerrar Sessão
          </Button>
        }
      />
    </div>
  );
};

export default PerfilProfissional;
