import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Search } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";

const Consultas = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Dados reais conforme o retorno da sua API
  const consultasData = [
    {
      id: 1,
      pacienteId: 1,
      nomePaciente: "João Frango",
      profissionalId: 2,
      nomeProfissional: "Dr. Arnaldo Silva",
      dataInicio: "2026-01-01T10:00:00",
      dataFim: "2026-01-01T11:00:00",
      statusConsulta: "AGENDADO"
    },
    {
      id: 2,
      pacienteId: 4,
      nomePaciente: "Maria Oliveira",
      profissionalId: 2,
      nomeProfissional: "Dr. Arnaldo Silva",
      dataInicio: "2026-01-01T14:30:00",
      dataFim: "2026-01-01T15:30:00",
      statusConsulta: "CONCLUIDO"
    }
  ];

  // Função simples para formatar a data ISO (Ex: 2026-01-01T10:00:00 -> 01/01/2026 às 10:00)
  const formatarDataHora = (isoString) => {
    const data = new Date(isoString);
    const dia = data.toLocaleDateString('pt-BR');
    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { dia, hora };
  };

  const filtrados = consultasData.filter(c => 
    c.nomePaciente.toLowerCase().includes(busca.toLowerCase()) || 
    c.nomeProfissional.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <BackButton label="Voltar" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">Agenda de Consultas</h1>
          <p className="text-dentista-body opacity-70">Controle de horários e profissionais.</p>
        </div>
        <Button 
          variant="primary" 
          icon={CalendarPlus} 
          onClick={() => navigate("/nova-consulta")}
        >
          Nova Consulta
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input 
          label="Pesquisar"
          placeholder="Nome do Paciente" 
          className="flex-1"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="secondary" icon={Search}>Filtrar</Button>
      </div>

      <ListContainer 
        columns={{ 
          col1: "Paciente / Profissional", 
          col2: "Data e Horário", 
          col3: "Ações" 
        }}
      >
        {filtrados.map((c) => {
          const { dia, hora } = formatarDataHora(c.dataInicio);
          
          return (
            <ListItem 
              key={c.id}
              title={c.nomePaciente}
              description={`Profissional: ${c.nomeProfissional}`}
              badgeText={`${dia} às ${hora}`}
              badgeColor="text-gray-500 bg-gray-50 border-gray-100"
              actionLabel="Ver Detalhes"
              onAction={() => console.log("Consulta ID:", c.id)}
            />
          );
        })}

        {filtrados.length === 0 && (
          <div className="text-center py-10 text-gray-400 font-medium">
            Nenhuma consulta agendada para os termos buscados.
          </div>
        )}
      </ListContainer>
    </div>
  );
};

export default Consultas;
