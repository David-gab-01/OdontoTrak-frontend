import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import SearchInput from "../components/SearchInput";
import StatsGroup from "../components/StatsGroup";
import QuickActions from "../components/QuickActions";
import AgendaSection from "../components/AgendaSection";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import WelcomeHeader from "../components/WelcomeHeader";
import { usePacientes } from "../hooks/usePacientes";

const Dashboard = () => {
  const [busca, setBusca] = useState("");
  const { pacientes, carregando, carregarPacientes } = usePacientes();

  useEffect(() => {
    carregarPacientes();
  }, [carregarPacientes]);

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

  const navigate = useNavigate();

  const atendimentosHoje = [
    { id: 1, nome: "João Silva", status: "AGUARDANDO" },
    { id: 2, nome: "Maria Santos", status: "EM_ATENDIMENTO" },
    { id: 3, nome: "Pedro Oliveira", status: "FINALIZADO" },
  ];

  const getStatusColor = (status) => {
    const cores = {
      AGUARDANDO: "text-orange-500 bg-orange-50 border-orange-100",
      EM_ATENDIMENTO: "text-blue-500 bg-blue-50 border-blue-100",
      FINALIZADO: "text-green-500 bg-green-50 border-green-100",
    };
    return cores[status] || "text-gray-500 bg-gray-50 border-gray-100";
  };

  return (
    <>
      <WelcomeHeader userName="Dr. Silva" role="Cirurgião Dentista" />

      <h1 className="text-2xl font-bold text-dentista-title mb-6">
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
            {carregando ? (
              <div className="text-center py-6">Carregando pacientes...</div>
            ) : pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((paciente) => (
                <div key={paciente.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-dentista-title">{paciente.nome || paciente.name || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">CPF: {paciente.cpf || '—'}</p>
                    <p className="text-sm text-gray-500">E-mail: {paciente.email || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" onClick={() => navigate(`/ficha-paciente/${paciente.id}`)}>
                      Ver Prontuário
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">Nenhum paciente encontrado.</div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-dentista-title mb-6">
        Ações rápidas
      </h1>
      <QuickActions />

      <h1 className="text-2xl font-bold text-dentista-title mb-6">
        Indicadores do Dia
      </h1>
      <StatsGroup />
      
      <AgendaSection />

      <ListContainer 
        title="Fluxo de Atendimento"
        columns={{ 
          col1: "Paciente", 
          col2: "Status", 
          col3: "Ação" 
        }}
      >
        {atendimentosHoje.map((atendimento) => (
          <ListItem 
            key={atendimento.id}
            title={atendimento.nome}
            badgeText={atendimento.status.replace("_", " ")}
            badgeColor={getStatusColor(atendimento.status)}
            actionLabel={atendimento.status === "FINALIZADO" ? "Ver Resumo" : "Atender"}
            onAction={() => console.log("Ação para o id:", atendimento.id)}
          />
        ))}
      </ListContainer>
    </>
  );
};

export default Dashboard;
