import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Clock, CheckCircle, Save } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";

const NovaConsulta = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <BackButton label="Voltar" />
      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">Agendar Nova Consulta</h1>
        <p className="text-dentista-body opacity-70">Selecione os participantes e defina o cronograma do atendimento.</p>
      </div>

      <div className="space-y-6">
        {/* Bloco 1: Seleção de Pessoas */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <User size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Participantes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              isSelect 
              label="Paciente *" 
              placeholder="Selecione o paciente..."
            >
              <option value="1">João Silva</option>
              <option value="2">Maria Oliveira</option>
              <option value="3">Carlos Eduardo</option>
            </Input>

            <Input 
              isSelect 
              label="Profissional *" 
              placeholder="Selecione o dentista..."
            >
              <option value="1">Dr. Arnaldo (Ortodontia)</option>
              <option value="2">Dra. Beatriz (Clínica Geral)</option>
              <option value="3">Dr. Cláudio (Implantodontia)</option>
            </Input>
          </div>
        </div>

        {/* Bloco 2: Datas conforme esperado pela API */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <Clock size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Data e Horário</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Início da Consulta *" 
              type="datetime-local" 
            />
            <Input 
              label="Fim da Consulta *" 
              type="datetime-local" 
            />
          </div>
        </div>

        {/* Bloco 3: Status (Regra de Negócio: Sempre AGENDADO na criação) */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <CheckCircle size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Status do Agendamento</h2>
          </div>

          <div className="max-w-xs">
            <Input 
              isSelect 
              label="Status da Consulta" 
              disabled 
              value="AGENDADO"
            >
              <option value="AGENDADO">AGENDADO</option>
            </Input>
            <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">
              Este campo é preenchido automaticamente pelo sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Ações Inferiores */}
      <div className="flex justify-end gap-4 mt-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          icon={Save}
          onClick={() => alert("Simulando envio dos dados para a API...")}
        >
          Confirmar Agendamento
        </Button>
      </div>
    </div>
  );
};

export default NovaConsulta;
