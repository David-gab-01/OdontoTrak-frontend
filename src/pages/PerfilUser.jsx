import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Mail, 
  Shield, 
  Award, 
  User as UserIcon,
  Info
} from 'lucide-react';

// contexto
import { useAuth } from '../contexts/AuthContext';

// Componentes e UI
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ProfileHeader from '../components/ProfileHeader';
import SectionCard from '../components/SectionCard';

const PerfilUser = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Função de logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleData = useMemo(() => {
    const roleAtiva = user?.perfis?.[0] || 'ROLE_USER';
    
    const config = {
      ROLE_ADMIN: { label: 'administrador', isDentista: false },
      ROLE_DENTISTA: { label: 'dentista', isDentista: true },
      ROLE_RECEPCIONISTA: { label: 'recepcionista', isDentista: false },
    };

    return config[roleAtiva] || { label: 'usuário', isDentista: false };
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4 animate-in fade-in duration-700">
      
      {/* Barra Superior */}
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <Button 
          variant="ghost" 
          icon={LogOut}
          onClick={handleLogout}
          className="text-red-500 hover:bg-red-50 transition-colors"
        >
          Sair do Sistema
        </Button>
      </div>

      {/* Header Principal*/}
      <ProfileHeader
        title={user.nome || "Usuário"}
        subtitle={`Perfil de ${roleData.label}`}
        avatarText={user.nome?.charAt(0).toUpperCase() || "U"}
        fields={[
          { label: 'E-mail de Acesso', value: user.sub }, // 'sub' geralmente é o e-mail no seu JWT
          { label: 'ID do Sistema', value: `#${user.id}` },
          { label: 'Status', value: 'Ativo' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Card de Informações de Conta */}
        <SectionCard title="Dados da Conta">
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-dentista-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">E-mail Principal</p>
                <p className="text-sm font-semibold text-dentista-title">{user.sub}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Info size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nota</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Dados detalhados como Telefone e CPF estarão disponíveis após a implementação do módulo de RH.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Card de Credenciais - Tratamento de Roles */}
        <SectionCard title="Permissões de Acesso">
          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nível de Acesso</p>
                <p className="text-sm font-medium text-dentista-title mt-1">
                  Seu nível de acesso é de <span className="font-bold text-dentista-primary lowercase">{roleData.label}</span>
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Sua conta possui permissões para operar o módulo de {roleData.isDentista ? 'atendimento clínico.' : 'gestão administrativa.'}
                </p>
              </div>
            </div>

            {/* Condicional para Dentistas baseada no Token */}
            {roleData.isDentista && (
              <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Registro Profissional</p>
                  <p className="text-sm font-bold text-dentista-title">
                    {user.registroProfissional || 'Consultar Administração'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Footer Informativo */}
      <div className="mt-10 p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-3">
        <UserIcon size={20} className="text-gray-400" />
        <p className="text-xs text-gray-500 font-medium">
          Sessão iniciada como <strong>{user.nome}</strong>. O token de acesso expira em breve.
        </p>
      </div>
    </div>
  );
};

export default PerfilUser;