import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importação necessária para navegação
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

// Seus componentes e hooks
import { useAgendamentos } from "../hooks/useAgendamentos";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { ChevronLeft, ChevronRight, CalendarPlus, RefreshCw, Clock } from "lucide-react";

const Agenda = () => {
  const navigate = useNavigate(); 
  const calendarRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  const { agendamentos, carregando, carregarAgendamentos } = useAgendamentos();

  useEffect(() => {
    carregarAgendamentos();
    // Captura o título formatado (Ex: "Março de 2026")
    setTimeout(() => {
      if (calendarRef.current) {
        setTitulo(calendarRef.current.getApi().view.title);
      }
    }, 100);
  }, [carregarAgendamentos]);

  const eventos = agendamentos.map((a) => ({
    id: a.id,
    title: a.nomePaciente,
    start: a.dataInicio,
    end: a.dataFim,
    classNames: [`status-${a.statusConsulta?.toLowerCase()}`],
    extendedProps: {
      profissional: a.nomeProfissional,
      status: a.statusConsulta,
    },
  }));

  const handleNavigate = (action) => {
    const api = calendarRef.current.getApi();
    api[action]();
    setTitulo(api.view.title);
  };

  const handleChangeView = (view) => {
    const api = calendarRef.current.getApi();
    api.changeView(view);
    setTitulo(api.view.title);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4 agenda-container">
      <BackButton label="Voltar" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 mt-6">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-6"
              onClick={() => handleChangeView("timeGridDay")}
            >
              Dia
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="px-6 shadow-sm"
              onClick={() => handleChangeView("timeGridWeek")}
            >
              Semana
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" icon={ChevronLeft} onClick={() => handleNavigate("prev")} />
            <Button variant="ghost" onClick={() => handleNavigate("today")} className="font-bold">Hoje</Button>
            <Button variant="ghost" icon={ChevronRight} onClick={() => handleNavigate("next")} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-dentista-title capitalize">
          {titulo}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={carregarAgendamentos} loading={carregando} />
          
          {/* Botão atualizado com navegação real */}
          <Button 
            variant="primary" 
            icon={CalendarPlus} 
            onClick={() => navigate("/nova-consulta")}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          locale={ptBrLocale}
          events={eventos}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          height="auto"
          nowIndicator={true}
          slotEventOverlap={false}
          eventContent={renderEventCard}
          dayHeaderContent={(args) => (
            <div className="py-2">
              <div className="text-gray-400 text-[11px] uppercase font-semibold">
                {args.date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
              </div>
              <div className={`text-xl font-bold ${args.isToday ? 'text-blue-500' : 'text-gray-700'}`}>
                {args.date.getDate()}
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex justify-center gap-10 mt-10 border-t pt-6 border-gray-100">
        <StatusBadge color="bg-[#10B981]" label="Confirmado" />
        <StatusBadge color="bg-blue-400" label="Aguardando" />
        <StatusBadge color="bg-red-500" label="Cancelado" />
        <StatusBadge color="bg-gray-200" label="Concluído" />
      </div>
    </div>
  );
};

function renderEventCard(eventInfo) {
  return (
    <div className="flex flex-col h-full w-full justify-center">
      <div className="flex items-center gap-1 mb-0.5">
        <Clock size={10} className="opacity-70" />
        <span className="text-[10px] font-bold">{eventInfo.timeText}</span>
      </div>
      <div className="font-bold text-[11px] leading-tight truncate">
        {eventInfo.event.title}
      </div>
      <div className="text-[9px] opacity-90 truncate font-medium">
        {eventInfo.event.extendedProps.profissional}
      </div>
    </div>
  );
}

const StatusBadge = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-xs font-semibold text-gray-500">{label}</span>
  </div>
);

export default Agenda;