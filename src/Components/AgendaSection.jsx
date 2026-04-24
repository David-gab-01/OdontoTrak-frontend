import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import Button from "./Button";
import "react-day-picker/dist/style.css";

const AgendaSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const agendamentos = [
    { id: 1, hora: "09:00", nome: "Ana Silva", tipo: "Avaliação", tel: "(11) 98888-7777" },
    { id: 2, hora: "10:30", nome: "Bruno Costa", tipo: "Limpeza", tel: "(11) 97777-6666" },
    { id: 3, hora: "14:00", nome: "Carla Souza", tipo: "Ortodontia", tel: "(11) 96666-5555" },
  ];

  return (
    <div className="mt-12">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-dentista-title">Agenda Clínica</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lado Esquerdo: Calendário */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-clinica shadow-sm border border-gray-100 flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
            />
          </div>
        </div>

        {/* Lado Direito: Lista */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dentista-title flex items-center gap-2">
              <Calendar size={20} className="text-dentista-primary" />
              {selectedDate?.toLocaleDateString("pt-BR", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </h2>
          </div>

          <div className="space-y-3">
            {agendamentos.map((paciente) => (
              <div key={paciente.id} className="bg-white p-5 rounded-clinica shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-dentista-primary/40 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="text-xl font-bold text-dentista-primary bg-blue-50 w-16 h-12 flex items-center justify-center rounded-lg">
                    {paciente.hora}
                  </div>
                  <div>
                    <h4 className="font-bold text-dentista-title text-lg">{paciente.nome}</h4>
                    <div className="flex items-center gap-3 text-sm text-dentista-body">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold uppercase">{paciente.tipo}</span>
                      <span className="italic">{paciente.tel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline">Ver Prontuário</Button>
                  <Button variant="primary">Iniciar Atendimento</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaSection;