import React from "react";
import { UserRound } from "lucide-react";
import SearchInput from "../components/SearchInput";
import StatsGroup from "../components/StatsGroup";
import QuickActions from "../components/QuickActions";
import AgendaSection from "../components/AgendaSection";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import WelcomeHeader from "../components/WelcomeHeader";

const Dashboard = () => {
  const atendimentosHoje = [
    { id: 1, nome: "João Silva", status: "AGUARDANDO" },
    { id: 2, nome: "Maria Santos", status: "EM_ATENDIMENTO" },
    { id: 3, nome: "Pedro Oliveira", status: "FINALIZADO" },
  ];

  // Mapa de cores baseado no status (Centraliza a lógica de estilo)
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
        buttonText="Search"
        fullWidth={true}
        className="mb-8"
      />

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