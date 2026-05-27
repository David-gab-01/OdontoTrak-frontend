import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import StatsGroup from "../components/StatsGroup";
import AgendaSection from "../components/AgendaSection";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import WelcomeHeader from "../components/WelcomeHeader";
import { usePacientes } from "../hooks/usePacientes";
import { useAgendamentos } from "../hooks/useAgendamentos";
import { useAuth } from "../contexts/AuthContext";

const DashboardDentista = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [busca, setBusca] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  
  const { pacientes, carregando: carregandoPacientes, carregarPacientes } = usePacientes();

  const {
    agendamentos,
    carregando: carregandoAgendamentos,
    carregarMeusAgendamentos
  } = useAgendamentos();

  const carregarDadosDashboard = useCallback(() => {
    carregarPacientes();
    carregarMeusAgendamentos();
  }, [carregarPacientes, carregarMeusAgendamentos]);

  useEffect(() => {
    carregarDadosDashboard();
  }, [carregarDadosDashboard]);

  // 1. PRIMEIRO: FILTRAR AS CONSULTAS DO DENTISTA BASEADO NO DIA SELECIONADO
  const minhasConsultasDoDia = useMemo(() => {
    if (!agendamentos || agendamentos.length === 0) return [];
    
    const dataAlvoStr = dataSelecionada.toLocaleDateString('pt-BR');
    
    return agendamentos.filter((consulta) => {
      if (!consulta.dataInicio) return false;
      const dataConsultaStr = new Date(consulta.dataInicio).toLocaleDateString('pt-BR');
      return dataConsultaStr === dataAlvoStr;
    });
  }, [agendamentos, dataSelecionada]);

  // 2. SEGUNDO: CALCULAR OS INDICADORES DINAMICAMENTE BASEADO APENAS NAS CONSULTAS DO DIA FILTRADO
  const resumoCalculadoFront = useMemo(() => {
    const contagem = {
      agendados: 0,
      pendentes: 0, // Representa o "Em Atendimento"
      concluidos: 0,
      cancelados: 0,
    };

    minhasConsultasDoDia.forEach((consulta) => {
      const status = consulta.statusConsulta?.toUpperCase();

      if (status === "AGENDADO") {
        contagem.agendados++;
      } else if (status === "PENDENTE" || status === "EM_ANDAMENTO") {
        contagem.pendentes++;
      } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(status)) {
        contagem.concluidos++;
      } else if (["CANCELADO", "CANCELADA"].includes(status)) {
        contagem.cancelados++;
      }
    });

    return contagem;
  }, [minhasConsultasDoDia]); 

  const formatarDataExtenso = (data) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const normalizarTexto = (texto = "") => String(texto).toLowerCase().trim();
  const normalizarCpf = (valor = "") => String(valor).replace(/\D/g, "");
  const termoBusca = normalizarTexto(busca);
  const termoCpf = normalizarCpf(busca);
  const buscaNumerica = /\d/.test(busca);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) => {
      const nome = normalizarTexto(p.nome || p.name || p.nomeCompleto || '');
      const cpf = normalizarCpf(p.cpf || '');
      const email = normalizarTexto(p.email || p.emailPaciente || '');
      const telefone = normalizarTexto(p.telefone || p.telefonePaciente || '');
      const buscaCpfValida = buscaNumerica && termoCpf.length > 0 && cpf.includes(termoCpf);
      const buscaTextoValida = termoBusca.length > 0 && (nome.includes(termoBusca) || email.includes(termoBusca) || telefone.includes(termoBusca));
      return buscaTextoValida || buscaCpfValida;
    });
  }, [pacientes, termoBusca, termoCpf, buscaNumerica]);

  // Alinhamento visual das cores do fluxo de trabalho baseado nos status reais
  const getStatusColor = (status) => {
    const cores = {
      AGENDADO: "text-blue-500 bg-blue-50 border-blue-100",
      EM_ANDAMENTO: "text-orange-500 bg-orange-50 border-orange-100",
      PENDENTE: "text-orange-500 bg-orange-50 border-orange-100",
      CONCLUIDO: "text-green-500 bg-green-50 border-green-100",
      CONCLUIDA: "text-green-500 bg-green-50 border-green-100",
      FINALIZADO: "text-green-500 bg-green-50 border-green-100",
      CANCELADO: "text-red-500 bg-red-50 border-red-100",
      CANCELADA: "text-red-500 bg-red-50 border-red-100",
    };
    return cores[status?.toUpperCase()] || "text-gray-500 bg-gray-50 border-gray-100";
  };

  const nomeDoutor = user?.nome || "Dentista";

  return (
    <>
      <WelcomeHeader userName={`Dr(a). ${nomeDoutor}`} role="Cirurgião Dentista — Minha Agenda Privada" />

      <h1 className="text-2xl font-bold text-dentista-title mb-6 mt-4">
        Buscar Pacientes
      </h1>
      <SearchInput
        placeholder="Procurar prontuário por CPF, nome ou telefone..."
        buttonText="Buscar"
        fullWidth={true}
        className="mb-8"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onButtonClick={() => setBusca(busca.trim())}
      />

      {busca && (
        <div className="mb-8">
          <p className="text-dentista-body mb-4">Resultados da busca:</p>
          <div className="grid gap-4">
            {carregandoPacientes ? (
              <div className="text-center py-6">Carregando pacientes...</div>
            ) : pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((paciente) => (
                <div key={paciente.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-dentista-title">{paciente.nome || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">CPF: {paciente.cpf || '—'}</p>
                    <p className="text-sm text-gray-500">E-mail: {paciente.email || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="bg-dentista-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dentista-primary/90 transition-colors"
                      onClick={() => navigate(`/ficha-paciente/${paciente.id}`)}
                    >
                      Ver Prontuário
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">Nenhum paciente encontrado.</div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-dentista-title mb-2">
        Meu Desempenho Diário
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Exibindo dados para o dia:{" "}
        <strong className="capitalize">{formatarDataExtenso(dataSelecionada)}</strong>
      </p>
      
      {/* 🎯 Agora o StatsGroup reflete dinamicamente as estatísticas do dia selecionado */}
      <StatsGroup 
        dados={resumoCalculadoFront} 
        carregando={carregandoAgendamentos}
      />
      
      <AgendaSection 
        dataSelecionada={dataSelecionada} 
        onDataAlterada={setDataSelecionada} 
        agendamentos={minhasConsultasDoDia} 
        carregando={carregandoAgendamentos}
      />

      <ListContainer 
        title={`Meu Fluxo de Trabalho — ${dataSelecionada.toLocaleDateString('pt-BR')}`}
        columns={{ 
          col1: "Paciente", 
          col2: "Status da Consulta", 
          col3: "Ação" 
        }}
      >
        {carregandoAgendamentos ? (
          <div className="text-center py-10">Carregando seus atendimentos...</div>
        ) : minhasConsultasDoDia.length > 0 ? (
          minhasConsultasDoDia.map((atendimento) => (
            <ListItem 
              key={atendimento.id}
              title={atendimento.nomePaciente || "Paciente não informado"}
              badgeText={atendimento.statusConsulta?.replace("_", " ") || "AGENDADO"}
              badgeColor={getStatusColor(atendimento.statusConsulta)}
              actionLabel={
                ['CONCLUIDO', 'FINALIZADO', 'CONCLUIDA'].includes(atendimento.statusConsulta?.toUpperCase()) 
                  ? "Ver Resumo" 
                  : "Atender Paciente"
              }
              onAction={() => navigate(`/ficha-consulta/${atendimento.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            Você não possui consultas marcadas na sua agenda para o dia selecionado.
          </div>
        )}
      </ListContainer>
    </>
  );
};

export default DashboardDentista;