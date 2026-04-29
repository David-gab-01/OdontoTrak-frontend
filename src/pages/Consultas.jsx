import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Search, RefreshCw } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";
import { useAgendamentos } from "../hooks/useAgendamentos"; 

const Consultas = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const { agendamentos, carregando, carregarAgendamentos, cancelarAgendamento } = useAgendamentos();

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const formatarDataHora = (isoString) => {
    const data = new Date(isoString);
    const dia = data.toLocaleDateString('pt-BR');
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { dia, hora };
  };

  const filtrados = agendamentos.filter(c => 
    c.nomePaciente?.toLowerCase().includes(busca.toLowerCase()) || 
    c.nomeProfissional?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <BackButton label="Voltar" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">Agenda de Consultas</h1>
          <p className="text-dentista-body opacity-70">Controle de horários e profissionais.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={carregarAgendamentos} loading={carregando} />
          <Button 
            variant="primary" 
            icon={CalendarPlus} 
            onClick={() => navigate("/nova-consulta")}
          >
            Nova Consulta
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input 
          label="Pesquisar"
          placeholder="Nome do Paciente ou Dentista" 
          className="flex-1"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="secondary" icon={Search}>Filtrar</Button>
      </div>

      <ListContainer columns={{ col1: "Paciente / Profissional", col2: "Data e Horário", col3: "Ações" }}>
        {carregando ? (
          <div className="text-center py-10">Buscando agenda...</div>
        ) : (
          filtrados.map((c) => {
            const { dia, hora } = formatarDataHora(c.dataInicio);
            return (
              <ListItem 
                key={c.id}
                title={c.nomePaciente || `Paciente ID: ${c.pacienteId}`}
                description={`Profissional: ${c.nomeProfissional || `ID: ${c.profissionalId}`}`}
                badgeText={`${dia} às ${hora}`}
                badgeColor={c.statusConsulta === "CONCLUIDO" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}
                actionLabel="Gerenciar"
                onAction={() => navigate(`/detalhes-consulta/${c.id}`)}
                onDelete={() => cancelarAgendamento(c.id)}
              />
            );
          })
        )}
      </ListContainer>
    </div>
  );
};

export default Consultas;