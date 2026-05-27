import React, { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

// Contexto e Hooks
import { useAuth } from "../contexts/AuthContext";
import { useAgendamentos } from "../hooks/useAgendamentos";

// Componentes e UI
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { ChevronLeft, ChevronRight, CalendarPlus, RefreshCw, Clock } from "lucide-react";

const Agenda = () => {
  const navigate = useNavigate(); 
  const calendarRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  
  // 1. Pega os dados do usuário autenticado
  const { user } = useAuth();
  
  // 2. Extrai os estados e as duas funções de carga do hook estruturado
  const { 
    agendamentos, 
    todosAgendamentos, 
    carregando, 
    carregarTodosAgendamentos, 
    carregarMeusAgendamentos 
  } = useAgendamentos();

  // 3. Define se o usuário logado é exclusivamente um Dentista
  const ehDentista = useMemo(() => {
    return user?.perfis?.[0] === 'ROLE_DENTISTA';
  }, [user]);

  // 4. Função de carga inteligente baseada na Role
  const atualizarDadosAgenda = React.useCallback(() => {
    if (ehDentista) {
      carregarMeusAgendamentos(); // GET /agendamentos/meus
    } else {
      carregarTodosAgendamentos(); // GET /agendamentos
    }
  }, [ehDentista, carregarTodosAgendamentos, carregarMeusAgendamentos]);

  useEffect(() => {
    atualizarDadosAgenda();
    
    setTimeout(() => {
      if (calendarRef.current) {
        setTitulo(calendarRef.current.getApi().view.title);
      }
    }, 100);
  }, [atualizarDadosAgenda]);

  // 5. Seleciona a fonte de dados correta para renderizar no calendário
  const listaParaExibir = ehDentista ? agendamentos : todosAgendamentos;

  const eventos = listaParaExibir.map((a) => {
    const statusNormalizado = a.statusConsulta?.toUpperCase();
    
    // Mapeamento de classe de estilização segura para o FullCalendar
    let classeStatus = "status-agendado"; // Default / CONFIRMADO
    if (statusNormalizado === "CANCELADO" || statusNormalizado === "CANCELADA") {
      classeStatus = "status-cancelado";
    } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(statusNormalizado)) {
      classeStatus = "status-concluido";
    }

    return {
      id: a.id,
      title: a.nomePaciente || "Paciente não informado",
      start: a.dataInicio,
      end: a.dataFim,
      classNames: [classeStatus], 
      extendedProps: {
        profissional: a.nomeProfissional,
        status: a.statusConsulta,
      },
    };
  });

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

        <div className="text-center">
          <h2 className="text-2xl font-bold text-dentista-title capitalize">
            {titulo}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {ehDentista ? "Visualizando suas consultas médicas" : "Visualizando agenda geral da clínica"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={atualizarDadosAgenda} loading={carregando} />
          
          {/* BOTÃO ADAPTATIVO: Oculta a criação de consultas se for apenas Dentista */}
          {!ehDentista && (
            <Button 
              variant="primary" 
              icon={CalendarPlus} 
              onClick={() => navigate("/nova-consulta")}
            >
              Novo Agendamento
            </Button>
          )}
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
          eventClick={(info) => navigate(`/ficha-consulta/${info.event.id}`)}
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
        <StatusBadge color="bg-[#10B981]" label="Agendado" />
        <StatusBadge color="bg-red-500" label="Cancelado" />
        <StatusBadge color="bg-gray-400" label="Concluído" />
      </div>
    </div>
  );
};

function renderEventCard(eventInfo) {
  
  const classes = eventInfo.event.classNames;
  const ehConcluido = classes.includes("status-concluido");

  return (
    <div className={`flex flex-col h-full w-full justify-center p-1 cursor-pointer ${ehConcluido ? 'text-gray-600' : 'text-white'}`}>
      <div className="flex items-center gap-1 mb-0.5">
        <Clock size={10} className="opacity-80" />
        <span className="text-[10px] font-bold">{eventInfo.timeText}</span>
      </div>
      <div className="font-bold text-[11px] leading-tight truncate">
        {eventInfo.event.title}
      </div>
      {eventInfo.event.extendedProps.profissional && (
        <div className={`text-[9px] opacity-90 truncate font-medium ${ehConcluido ? 'text-gray-500' : 'text-white/80'}`}>
          {eventInfo.event.extendedProps.profissional}
        </div>
      )}
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