import React from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "react-day-picker/dist/style.css";

const AgendaSection = ({ dataSelecionada, onDataAlterada, agendamentos = [], carregando }) => {
  const navigate = useNavigate();

  // Função para formatar o horário a partir de uma String ISO (ex: "2026-05-20T14:30:00" -> "14:30")
  const formatarHora = (dataString) => {
    if (!dataString) return "--:--";
    try {
      const data = new Date(dataString);
      return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <div className="mt-12 mb-10">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-dentista-title">Agenda Clínica</h1>
        <p className="text-sm text-gray-400">Selecione uma data para filtrar as consultas marcadas.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lado Esquerdo: Calendário Reativo conectado ao Dashboard */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-clinica shadow-sm border border-gray-100 flex justify-center">
            <DayPicker
              mode="single"
              selected={dataSelecionada}
              onSelect={(date) => date && onDataAlterada(date)} // Só altera se clicar em uma data válida
              locale={ptBR}
            />
          </div>
        </div>

        {/* Lado Direito: Lista Dinâmica de Consultas */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dentista-title flex items-center gap-2">
              <Calendar size={20} className="text-dentista-primary" />
              {dataSelecionada?.toLocaleDateString("pt-BR", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </h2>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-gray-500 font-medium">
              {agendamentos.length} {agendamentos.length === 1 ? "consulta" : "consultas"}
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {carregando ? (
              <div className="text-center py-10 text-gray-400 bg-white rounded-clinica border border-gray-100 shadow-sm">
                Carregando horários marcados...
              </div>
            ) : agendamentos.length > 0 ? (
              // Ordena as consultas do dia por horário de início antes de renderizar
              [...agendamentos]
                .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
                .map((consulta) => (
                  <div 
                    key={consulta.id} 
                    className="bg-white p-5 rounded-clinica shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-dentista-primary/40 transition-all group"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      {/* Horário extraído do dataInicio da API */}
                      <div className="text-xl font-bold text-dentista-primary bg-blue-50 w-20 h-12 flex items-center justify-center rounded-lg shadow-sm shrink-0">
                        {formatarHora(consulta.dataInicio)}
                      </div>
                      <div>
                        <h4 className="font-bold text-dentista-title text-lg">
                          {consulta.nomePaciente || "Paciente não informado"}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-dentista-body mt-0.5">
                          <span className="text-xs font-semibold uppercase text-gray-600 bg-slate-100 px-2 py-0.5 rounded w-max">
                            Dentista: {consulta.nomeProfissional || "Não assinalado"}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            Status: <strong className="text-dentista-primary">{consulta.statusConsulta}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      {/* Redirecionamentos mapeados para as fichas corretas */}
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/ficha-paciente/${consulta.pacienteId}`)}
                        disabled={!consulta.pacienteId}
                      >
                        Ver Prontuário
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={() => navigate(`/ficha-consulta/${consulta.id}`)}
                      >
                        Gerenciar
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-gray-400 bg-white rounded-clinica border border-gray-100 shadow-sm border-dashed">
                Nenhuma consulta agendada para este dia.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaSection;