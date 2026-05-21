import React from "react";
import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-clinica shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs text-dentista-body uppercase tracking-wider font-semibold opacity-70">{title}</p>
      <p className="text-3xl font-bold text-dentista-title mt-1">{value}</p>
    </div>
    <div className={`${colorClass} opacity-80 p-2 rounded-lg bg-slate-50 border border-gray-100`}>
      <Icon size={28} />
    </div>
  </div>
);

const StatsGroup = ({ dados, carregando }) => {
  const valores = {
    agendados: dados?.agendados || 0,
    pendentes: dados?.pendentes || 0,
    concluidos: dados?.concluidos || 0,
    cancelados: dados?.cancelados || 0,
  };

  const stats = [
    { 
      title: "Confirmados / Agendados", 
      value: carregando ? "..." : String(valores.agendados).padStart(2, "0"),
      icon: CalendarDays,
      colorClass: "text-blue-500"
    },
    { 
      title: "Em Atendimento", 
      value: carregando ? "..." : String(valores.pendentes).padStart(2, "0"),
      icon: Clock,
      colorClass: "text-orange-500"
    },
    { 
      title: "Concluídos", 
      value: carregando ? "..." : String(valores.concluidos).padStart(2, "0"),
      icon: CheckCircle2,
      colorClass: "text-green-500"
    },
    { 
      title: "Cancelados", 
      value: carregando ? "..." : String(valores.cancelados).padStart(2, "0"),
      icon: XCircle,
      colorClass: "text-red-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          title={stat.title} 
          value={stat.value} 
          icon={stat.icon}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
};

export default StatsGroup;