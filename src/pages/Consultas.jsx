import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Search, RefreshCw } from "lucide-react";

// Contexto e Hooks
import { useAuth } from "../contexts/AuthContext";
import { useAgendamentos } from "../hooks/useAgendamentos"; 

// Componentes
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";

const Consultas = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  
  // 1. Identificação do Perfil ativo
  const { user } = useAuth();
  
  const { 
    agendamentos, 
    todosAgendamentos, 
    carregando, 
    carregarTodosAgendamentos, 
    carregarMeusAgendamentos, 
    cancelarAgendamento 
  } = useAgendamentos();

  const ehDentista = useMemo(() => {
    return user?.perfis?.[0] === 'ROLE_DENTISTA';
  }, [user]);

  // 2. Carga condicional idêntica à lógica do calendário
  const carregarListaConsultas = React.useCallback(() => {
    if (ehDentista) {
      carregarMeusAgendamentos();
    } else {
      carregarTodosAgendamentos();
    }
  }, [ehDentista, carregarTodosAgendamentos, carregarMeusAgendamentos]);

  useEffect(() => {
    carregarListaConsultas();
  }, [carregarListaConsultas]);

  const formatarDataHora = (isoString) => {
    if (!isoString) return { dia: "—", hora: "—" };
    const data = new Date(isoString);
    const dia = data.toLocaleDateString('pt-BR');
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { dia, hora };
  };

  // 3. Seleciona a fonte correta de filtragem baseada na Role
  const listaBase = ehDentista ? agendamentos : todosAgendamentos;

  const filtrados = listaBase.filter(c => 
    c.nomePaciente?.toLowerCase().includes(busca.toLowerCase()) || 
    c.nomeProfissional?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <BackButton label="Voltar" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">
            {ehDentista ? "Meus Atendimentos Marcados" : "Agenda de Consultas da Clínica"}
          </h1>
          <p className="text-dentista-body opacity-70">
            {ehDentista ? "Gerenciamento e histórico dos seus pacientes." : "Controle geral de horários e profissionais."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={carregarListaConsultas} loading={carregando} />
          
          {/* Oculta botão de criar se for Dentista */}
          {!ehDentista && (
            <Button 
              variant="primary" 
              icon={CalendarPlus} 
              onClick={() => navigate("/nova-consulta")}
            >
              Nova Consulta
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input 
          label="Pesquisar por termo"
          placeholder={ehDentista ? "Digite o nome do paciente..." : "Nome do Paciente ou Dentista"} 
          className="flex-1"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="secondary" icon={Search}>Filtrar</Button>
      </div>

      <ListContainer 
        columns={{ 
          col1: ehDentista ? "Paciente" : "Paciente / Profissional", 
          col2: "Data e Horário", 
          col3: "Ações" 
        }}
      >
        {carregando ? (
          <div className="text-center py-10">Buscando lista de agendamentos...</div>
        ) : filtrados.length > 0 ? (
          filtrados.map((c) => {
            const { dia, hora } = formatarDataHora(c.dataInicio);
            return (
              <ListItem 
                key={c.id}
                title={c.nomePaciente || `Paciente ID: ${c.pacienteId}`}
                // Se for dentista, removemos o texto redundante "Profissional: Dr. Você"
                description={ehDentista ? `Status: ${c.statusConsulta}` : `Profissional: ${c.nomeProfissional || 'Não informado'}`}
                badgeText={`${dia} às ${hora}`}
                badgeColor={
                  ['CONCLUIDO', 'FINALIZADO'].includes(c.statusConsulta?.toUpperCase()) 
                    ? "text-green-600 bg-green-50 border-green-100" 
                    : "text-blue-600 bg-blue-50 border-blue-100"
                }
                actionLabel={ehDentista ? "Atender" : "Gerenciar"}
                onAction={() => navigate(`/ficha-consulta/${c.id}`)}
                // Apenas recepção ou admins podem remover/cancelar uma consulta diretamente da lista
                onDelete={!ehDentista ? () => cancelarAgendamento(c.id) : undefined}
              />
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed">
            Nenhum registro encontrado para os critérios informados.
          </div>
        )}
      </ListContainer>
    </div>
  );
};

export default Consultas;