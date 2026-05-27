import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Mail, 
  Shield, 
  Award, 
  User as UserIcon,
  Phone,
  FileText,
  Briefcase
} from 'lucide-react';

// Contexto
import { useAuth } from '../contexts/AuthContext';

//hooks
import { useProfissionais } from '../hooks/useProfissionais'; 

// Componentes e UI
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ProfileHeader from '../components/ProfileHeader';
import SectionCard from '../components/SectionCard';

const PerfilUser = () => {
  const navigate = useNavigate();
  const { user: userToken, logout } = useAuth();
  
  const { 
    profissionalSelecionado, 
    carregando, 
    carregarProfissionalPorId 
  } = useProfissionais();

  // Dispara a busca assim que o componente monta e o ID do token está disponível
  useEffect(() => {
    if (userToken?.id) {
      carregarProfissionalPorId(userToken.id);
    }
  }, [userToken?.id, carregarProfissionalPorId]);

  // Função de logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define as regras de exibição baseadas no perfil 
  const roleData = useMemo(() => {
    const roleAtiva = profissionalSelecionado?.perfis?.[0] || userToken?.perfis?.[0] || 'ROLE_USER';
    
    const config = {
      ROLE_ADMIN: { label: 'administrador', isDentista: false },
      ROLE_DENTISTA: { label: 'dentista', isDentista: true },
      ROLE_RECEPCIONISTA: { label: 'recepcionista', isDentista: false },
    };

    return config[roleAtiva] || { label: 'usuário', isDentista: false };
  }, [profissionalSelecionado, userToken]);

  if (!userToken) return null;

  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-500 font-medium">
        Carregando informações detalhadas do perfil...
      </div>
    );
  }

  // Objeto unificado priorizando os dados que vieram do banco de dados (via hook)
  const dadosExibicao = profissionalSelecionado || userToken;

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

      {/* Header Principal */}
      <ProfileHeader
        title={dadosExibicao.nome || "Usuário"}
        subtitle={`Perfil de ${roleData.label}`}
        avatarText={dadosExibicao.nome?.charAt(0).toUpperCase() || "U"}
        fields={[
          { label: 'E-mail de Acesso', value: dadosExibicao.email || dadosExibicao.sub }, 
          { label: 'ID do Sistema', value: `#${dadosExibicao.id}` },
          { label: 'Status da Conta', value: dadosExibicao.ativo !== false ? 'Ativo' : 'Inativo' },
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
                <p className="text-sm font-semibold text-dentista-title">{dadosExibicao.email || dadosExibicao.sub}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Telefone / WhatsApp</p>
                <p className="text-sm font-semibold text-dentista-title">{dadosExibicao.telefone || "Não informado"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CPF</p>
                <p className="text-sm font-semibold text-dentista-title">{dadosExibicao.cpf || "Não informado"}</p>
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

            {/* Condicional para Dentistas baseada no useProfissionais */}
            {roleData.isDentista && (
              <>
                <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Registro Profissional (CRO)</p>
                    <p className="text-sm font-bold text-dentista-title">
                      {dadosExibicao.registroProfissional || dadosExibicao.cro || 'Não cadastrado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Especialidade Clínica</p>
                    <p className="text-sm font-bold text-dentista-title">
                      {dadosExibicao.especialidade || 'Clínica Geral'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Footer Informativo */}
      <div className="mt-10 p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-3">
        <UserIcon size={20} className="text-gray-400" />
        <p className="text-xs text-gray-500 font-medium">
          Sessão iniciada como <strong>{dadosExibicao.nome}</strong>. Informações sincronizadas diretamente com a base de profissionais.
        </p>
      </div>
    </div>
  );
};

export default PerfilUser;