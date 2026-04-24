import React from "react";
import Button from "./Button";
const AttendanceFlow = () => {
  const fluxoAtendimento = [
    { id: 1, nome: "João Silva", status: "Aguardando", cor: "text-orange-500 bg-orange-50 border-orange-100" },
    { id: 2, nome: "Maria Santos", status: "Em atendimento", cor: "text-blue-500 bg-blue-50 border-blue-100" },
    { id: 3, nome: "Pedro Oliveira", status: "Finalizado", cor: "text-green-500 bg-green-50 border-green-100" },
  ];

  return (
    <div className="mt-12 mb-10">
      <h1 className="text-2xl font-bold text-dentista-title mb-6">Fluxo de atendimento</h1>

      <div className="bg-white p-6 rounded-clinica shadow-sm border border-gray-100">
        <div className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Buscar paciente por nome..." 
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-dentista-primary text-sm"
          />
          <button className="px-6 py-3 border border-dentista-primary text-dentista-primary rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Filtros
          </button>
        </div>

        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-12 px-4 mb-4 text-xs font-bold text-dentista-body uppercase tracking-widest">
          <div className="col-span-5">Paciente</div>
          <div className="col-span-4 text-center">Status</div>
          <div className="col-span-3 text-right">Ações</div>
        </div>

        {/* Lista de Pacientes */}
        <div className="space-y-2">
          {fluxoAtendimento.map((paciente) => (
            <div key={paciente.id} className="grid grid-cols-12 items-center px-4 py-4 border border-transparent hover:border-gray-100 hover:bg-slate-50/50 rounded-xl transition-all">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-dentista-primary">
                  {paciente.nome.charAt(0)}
                </div>
                <span className="font-bold text-dentista-title">{paciente.nome}</span>
              </div>
              <div className="col-span-4 flex justify-center">
                <span className={`px-4 py-1 rounded-full text-xs font-bold border ${paciente.cor}`}>
                  {paciente.status}
                </span>
              </div>
              <div className="col-span-3 text-right">
             <Button variant="primary">
              Ver Ficha
             </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceFlow;