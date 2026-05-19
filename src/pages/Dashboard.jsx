import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import StatsGroup from "../components/StatsGroup";
import QuickActions from "../components/QuickActions";
import AgendaSection from "../components/AgendaSection";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import WelcomeHeader from "../components/WelcomeHeader";
import { usePacientes } from "../hooks/usePacientes";
import { useAgendamentos } from "../hooks/useAgendamentos";

const Dashboard = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Estado para controlar a data selecionada no calendário do AgendaSection
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // 1. Hook de Pacientes para a busca global
  const {
    pacientes,
    carregando: carregandoPacientes,
    carregarPacientes,
  } = usePacientes();

  // 2. Hook de Agendamentos com as rotas GLOBAIS da Clínica
  const {
    todosAgendamentos,
    carregando: carregandoAgendamentos,
    carregarTodosAgendamentos,
  } = useAgendamentos();

  useEffect(() => {
    carregarPacientes();
    carregarTodosAgendamentos(); // Traz a listagem global de agendamentos da clínica
  }, [carregarPacientes, carregarTodosAgendamentos]);

  // --- LÓGICA DE FILTRAGEM DA BUSCA DE PACIENTES ---
  const normalizarTexto = (texto = "") => String(texto).toLowerCase().trim();
  const normalizarCpf = (valor = "") => String(valor).replace(/\D/g, "");
  const termoBusca = normalizarTexto(busca);
  const termoCpf = normalizarCpf(busca);
  const buscaNumerica = /\d/.test(busca);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) => {
      const nome = normalizarTexto(p.nome || p.name || p.nomeCompleto || "");
      const cpf = normalizarCpf(p.cpf || "");
      const email = normalizarTexto(p.email || p.emailPaciente || "");
      const telefone = normalizarTexto(p.telefone || p.telefonePaciente || "");
      const buscaCpfValida =
        buscaNumerica && termoCpf.length > 0 && cpf.includes(termoCpf);
      const buscaTextoValida =
        termoBusca.length > 0 &&
        (nome.includes(termoBusca) ||
          email.includes(termoBusca) ||
          telefone.includes(termoBusca));
      return buscaTextoValida || buscaCpfValida;
    });
  }, [pacientes, termoBusca, termoCpf, buscaNumerica]);

  // --- REATIVIDADE POR DATA: FILTRAR AGENDAMENTOS DO DIA SELECIONADO ---
  const atendimentosDoDia = useMemo(() => {
    const dataAlvoStr = dataSelecionada.toLocaleDateString("pt-BR"); // Formato "DD/MM/YYYY"

    return todosAgendamentos.filter((consulta) => {
      if (!consulta.dataInicio) return false;
      const dataConsultaStr = new Date(consulta.dataInicio).toLocaleDateString(
        "pt-BR",
      );
      return dataConsultaStr === dataAlvoStr;
    });
  }, [todosAgendamentos, dataSelecionada]);

  // --- REATIVIDADE POR DATA: CALCULAR OS INDICADORES (STATS) BASEADO NO DIA SELECIONADO ---
  const resumoDoDia = useMemo(() => {
    const resumo = { agendados: 0, pendentes: 0, concluidos: 0, cancelados: 0 };

    atendimentosDoDia.forEach((item) => {
      const status = item.statusConsulta?.toUpperCase();
      if (["CONCLUIDO", "CONCLUIDA", "FINALIZADO"].includes(status)) {
        resumo.concluidos += 1;
      } else if (status === "CANCELADO") {
        resumo.cancelados += 1;
      } else if (status === "EM_ANDAMENTO") {
        resumo.pendentes += 1; // Ou mapeie conforme o comportamento do seu StatsGroup
      } else {
        resumo.agendados += 1;
      }
    });

    return resumo;
  }, [atendimentosDoDia]);

  // Mapeamento de Cores para os Status da API
  const getStatusColor = (status) => {
    const cores = {
      AGENDADO: "text-blue-500 bg-blue-50 border-blue-100",
      EM_ANDAMENTO: "text-orange-500 bg-orange-50 border-orange-100",
      CONCLUIDO: "text-green-500 bg-green-50 border-green-100",
      FINALIZADO: "text-green-500 bg-green-50 border-green-100",
      PENDENTE: "text-gray-500 bg-gray-50 border-gray-100",
      CANCELADO: "text-red-500 bg-red-50 border-red-100",
    };
    return (
      cores[status?.toUpperCase()] || "text-gray-500 bg-gray-50 border-gray-100"
    );
  };

  const formatarDataExtenso = (date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Header fixo de Recepção / Admin clínica */}
      <WelcomeHeader
        userName="Painel de Controle"
        role="Administração da Clínica"
      />

      <h1 className="text-2xl font-bold text-dentista-title mb-6 mt-4">
        Buscar Pacientes
      </h1>
      <SearchInput
        placeholder="Procurar por CPF, nome ou telefone..."
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
                <div
                  key={paciente.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-dentista-title">
                      {paciente.nome || "Paciente"}
                    </p>
                    <p className="text-sm text-gray-500">
                      CPF: {paciente.cpf || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      E-mail: {paciente.email || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/ficha-paciente/${paciente.id}`)}
                    >
                      Ver Prontuário
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Nenhum paciente encontrado.
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-dentista-title mb-6">
        Ações rápidas
      </h1>
      <QuickActions />

      <h1 className="text-2xl font-bold text-dentista-title mb-2">
        Indicadores Gerais
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Exibindo dados para o dia:{" "}
        <strong>{formatarDataExtenso(dataSelecionada)}</strong>
      </p>

      {/* O StatsGroup agora reflete dinamicamente o dia clicado no calendário */}
      <StatsGroup dados={resumoDoDia} carregando={carregandoAgendamentos} />

      {/* Passamos o estado da data e a função de alteração para o calendário interno redefinir o dia */}
      <AgendaSection
        dataSelecionada={dataSelecionada}
        onDataAlterada={setDataSelecionada}
        agendamentos={atendimentosDoDia}
        carregando={carregandoAgendamentos}
      />

      <ListContainer
        title={`Fluxo de Atendimento Geral — ${dataSelecionada.toLocaleDateString("pt-BR")}`}
        columns={{
          col1: "Paciente / Dentista",
          col2: "Status",
          col3: "Ação",
        }}
      >
        {carregandoAgendamentos ? (
          <div className="text-center py-6">Carregando consultas do dia...</div>
        ) : atendimentosDoDia.length > 0 ? (
          atendimentosDoDia.map((atendimento) => (
            <ListItem
              key={atendimento.id}
              title={atendimento.nomePaciente || "Paciente não informado"}
              description={`Dentista: ${atendimento.nomeProfissional || "Não informado"}`}
              badgeText={
                atendimento.statusConsulta?.replace("_", " ") || "AGENDADO"
              }
              badgeColor={getStatusColor(atendimento.statusConsulta)}
              actionLabel={
                ["CONCLUIDO", "FINALIZADO"].includes(
                  atendimento.statusConsulta?.toUpperCase(),
                )
                  ? "Ver Resumo"
                  : "Gerenciar"
              }
              onAction={() => navigate(`/ficha-consulta/${atendimento.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            Nenhuma consulta agendada na clínica para a data selecionada.
          </div>
        )}
      </ListContainer>
    </>
  );
};

export default Dashboard;
