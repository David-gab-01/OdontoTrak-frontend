import React from "react";
import { Check } from "lucide-react";

const ETAPAS = [
  { id: 1, label: "Recepção" },
  { id: 2, label: "Avaliação" },
  { id: 3, label: "Procedimento" },
  { id: 4, label: "Conclusão" },
];

export const StepperConsulta = ({ etapaAtual, consultaEncerrada }) => (
  <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-6 mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      {ETAPAS.map((etapa, index) => {
        const ativa = etapaAtual === etapa.id && !consultaEncerrada;
        const concluida = etapaAtual > etapa.id || consultaEncerrada;

        return (
          <React.Fragment key={etapa.id}>
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border transition ${
                  concluida
                    ? "bg-green-500 text-white border-green-500"
                    : ativa
                    ? "bg-dentista-primary text-white border-dentista-primary"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {concluida ? <Check size={22} /> : etapa.id}
              </div>

              <div>
                <p className={`text-sm font-bold ${ativa ? "text-dentista-primary" : "text-dentista-title"}`}>
                  {etapa.label}
                </p>
                <p className="text-xs text-dentista-body">
                  {ativa ? "Etapa atual" : concluida ? "Concluída" : "Pendente"}
                </p>
              </div>
            </div>

            {index < ETAPAS.length - 1 && (
              <div className="hidden md:block text-gray-300 font-bold">&gt;</div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);