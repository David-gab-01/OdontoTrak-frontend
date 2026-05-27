import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Search, RefreshCw, Filter } from "lucide-react";

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
  const [statusFiltro, setStatusFiltro] = useState("TODOS"); 
  
  // Identificação do Perfil ativo
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

  // Seleciona a fonte correta de filtragem baseada na Role e aplica os filtros
  const listaBase = ehDentista ? agendamentos : todosAgendamentos;

  const filtrados = useMemo(() => {
    return listaBase.filter(c => {
      const termo = busca.toLowerCase();
      const bateTexto = 
        c.nomePaciente?.toLowerCase().includes(termo) || 
        c.nomeProfissional?.toLowerCase().includes(termo);

      const statusNormalizado = c.statusConsulta?.toUpperCase();
      let categoriaStatus = "AGENDADO"; // Default / CONFIRMADO

      if (statusNormalizado === "CANCELADO" || statusNormalizado === "CANCELADA") {
        categoriaStatus = "CANCELADO";
      } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(statusNormalizado)) {
        categoriaStatus = "CONCLUIDO";
      }

      const bateStatus = statusFiltro === "TODOS" || categoriaStatus === statusFiltro;

      return bateTexto && bateStatus;
    });
  }, [listaBase, busca, statusFiltro]);

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <BackButton label="Voltar" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">
            {ehDentista ? "Meus Atendimentos Marcados" : "Lista de Consultas Agendadas"}
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

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 flex gap-4 items-end">
        <Input 
          label="Pesquisar por termo"
          placeholder={ehDentista ? "Digite o nome do paciente..." : "Nome do Paciente ou Dentista"} 
          className="flex-1"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="secondary" icon={Search}>Filtrar</Button>
      </div>

      <div className="bg-gray-50 border-x border-b border-gray-100 p-3 rounded-b-2xl mb-6 flex flex-wrap gap-2 items-center pl-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter size={12} /> Status:
        </span>
        <button 
          onClick={() => setStatusFiltro("TODOS")}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${statusFiltro === "TODOS" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}`}
        >
          Todos ({listaBase.length})
        </button>
        <button 
          onClick={() => setStatusFiltro("AGENDADO")}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${statusFiltro === "AGENDADO" ? "bg-[#10B981] text-white border-[#10B981] shadow-sm" : "bg-white text-[#10B981] border-gray-100 hover:bg-emerald-50"}`}
        >
          Agendados
        </button>
        <button 
          onClick={() => setStatusFiltro("CANCELADO")}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${statusFiltro === "CANCELADO" ? "bg-red-500 text-white border-red-500 shadow-sm" : "bg-white text-red-500 border-gray-100 hover:bg-red-50"}`}
        >
          Cancelados
        </button>
        <button 
          onClick={() => setStatusFiltro("CONCLUIDO")}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${statusFiltro === "CONCLUIDO" ? "bg-gray-400 text-white border-gray-400 shadow-sm" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-100"}`}
        >
          Concluídos
        </button>
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
            const statusUpper = c.statusConsulta?.toUpperCase();

            let badgeEstilo = "text-emerald-700 bg-emerald-50 border-emerald-100"; // Default: AGENDADO
            let labelExibicao = "Agendado";

            if (statusUpper === "CANCELADO" || statusUpper === "CANCELADA") {
              badgeEstilo = "text-red-700 bg-red-50 border-red-100";
              labelExibicao = "Cancelado";
            } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(statusUpper)) {
              badgeEstilo = "text-gray-700 bg-gray-100 border-gray-200";
              labelExibicao = "Concluído";
            }

            return (
              <ListItem 
                key={c.id}
                title={c.nomePaciente || `Paciente ID: ${c.pacienteId}`}
                description={
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    {!ehDentista && <span className="text-xs text-gray-500">Profissional: {c.nomeProfissional || 'Não informado'}</span>}
                    <span className="text-[11px] font-medium text-gray-400">
                      Status: <strong className="uppercase text-[10px]">{labelExibicao}</strong>
                    </span>
                  </div>
                }
                badgeText={`${dia} às ${hora}`}
                badgeColor={badgeEstilo} 
                actionLabel={ehDentista ? "Atender" : "Gerenciar"}
                onAction={() => navigate(`/ficha-consulta/${c.id}`)}
                // O botão de cancelar só aparece se a consulta ainda não estiver cancelada nem concluída
                onDelete={(!ehDentista && labelExibicao === "Agendado") ? () => cancelarAgendamento(c.id) : undefined}
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