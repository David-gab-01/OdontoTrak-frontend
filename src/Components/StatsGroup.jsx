import React from "react";
import { Users } from "lucide-react";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-clinica shadow-sm border border-gray-100 flex justify-between items-center">
    <div>
      <p className="text-xs text-dentista-body uppercase tracking-wider font-semibold">{title}</p>
      <p className="text-3xl font-bold text-dentista-title">{value}</p>
    </div>
    <div className="text-dentista-body opacity-20">
      <Users size={40} />
    </div>
  </div>
);

const StatsGroup = () => {
  const stats = [
    { title: "Pacientes Hoje", value: "04" },
    { title: "Aguardando", value: "04" },
    { title: "Em atendimento", value: "04" },
    { title: "Tratamentos", value: "04" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

export default StatsGroup;