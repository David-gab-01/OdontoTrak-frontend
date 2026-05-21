import React, { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const DENTES_SUPERIORES = [
  "D18", "D17", "D16", "D15", "D14", "D13", "D12", "D11",
  "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28",
];

const DENTES_INFERIORES = [
  "D48", "D47", "D46", "D45", "D44", "D43", "D42", "D41",
  "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38",
];

const STATUS_OPTIONS = [
  { value: "SAUDAVEL", label: "Saudável", color: "bg-emerald-500" },
  { value: "CARIADO", label: "Cariado", color: "bg-red-500" },
  { value: "RESTAURADO", label: "Restaurado", color: "bg-blue-500" },
  { value: "AUSENTE", label: "Ausente", color: "bg-gray-300" },
  { value: "PROTETICO", label: "Protético", color: "bg-purple-500" },
  { value: "IMPLANTE", label: "Implante", color: "bg-amber-500" },
];

const statusStyles = {
  SAUDAVEL: {
    card: "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60 text-emerald-700",
    tooth: "bg-emerald-500 border-emerald-600",
    text: "text-emerald-600",
  },
  CARIADO: {
    card: "border-red-200 bg-red-50/30 hover:bg-red-50/60 text-red-700",
    tooth: "bg-red-500 border-red-600",
    text: "text-red-600",
  },
  RESTAURADO: {
    card: "border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 text-blue-700",
    tooth: "bg-blue-500 border-blue-600",
    text: "text-blue-600",
  },
  AUSENTE: {
    card: "border-gray-200 bg-gray-50/50 text-gray-400 opacity-40",
    tooth: "bg-gray-100 border-gray-200",
    text: "text-gray-400",
  },
  PROTETICO: {
    card: "border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 text-purple-700",
    tooth: "bg-purple-500 border-purple-600",
    text: "text-purple-600",
  },
  IMPLANTE: {
    card: "border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 text-amber-700",
    tooth: "bg-amber-500 border-amber-600",
    text: "text-amber-600",
  },
};

const Odontograma = ({ dentes = {}, onChange, disabled = false }) => {
  const [denteSelecionado, setDenteSelecionado] = useState(null);

  const fecharModal = () => setDenteSelecionado(null);

  const alterarStatus = (statusDente) => {
    if (!denteSelecionado || disabled) return;

    onChange?.({
      ...dentes,
      [denteSelecionado]: statusDente,
    });

    fecharModal();
  };

  const abrirModal = (dente) => {
    if (disabled) return;
    setDenteSelecionado(dente);
  };

  const renderDente = (dente) => {
    const status = dentes[dente] || "SAUDAVEL";
    const style = statusStyles[status] || statusStyles.SAUDAVEL;

    return (
      <button
        key={dente}
        type="button"
        disabled={disabled}
        onClick={() => abrirModal(dente)}
        className={`
          flex flex-col items-center justify-between
          rounded-xl
          border
          p-1.5
          min-w-[38px]
          w-full
          text-center
          transition-all
          duration-150
          ${!disabled ? "hover:scale-105 cursor-pointer" : "cursor-default"}
          ${style.card}
        `}
      >
        {/* Parte Anatômica */}
        <div className="w-full flex justify-center mb-1">
          <div
            className={`
              h-5 w-4
              rounded-b-lg
              rounded-t-sm
              border-b
              shadow-inner
              transition-all
              ${style.tooth}
            `}
          />
        </div>

        {/* Número do dente */}
        <p className={`text-[10px] font-bold ${style.text}`}>
          {dente.replace("D", "")}
        </p>
      </button>
    );
  };

  const statusAtual = dentes[denteSelecionado] || "SAUDAVEL";

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Mapeamento Odontograma</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {disabled 
            ? "Visualização estática do prontuário do paciente." 
            : "Selecione o dente para alterar o status em tempo real."}
        </p>
      </div>

      {/* Grade Geral das Arcadas */}
      <div className="rounded-2xl border border-gray-100 bg-slate-50/40 p-4">
        
        {/* Arcada Superior */}
        <div className="mb-4">
          <h3 className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Arcada Superior
          </h3>
          
          {!disabled ? (
            /* TELA 1 (Edição): Ativa a rolagem horizontal caso falte espaço */
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex justify-between gap-1 min-w-[640px]">
                {DENTES_SUPERIORES.map(renderDente)}
              </div>
            </div>
          ) : (
            /* TELA 2 (Consolidado): Empilha os dentes nativamente para caber no espaço */
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1.5 w-full">
              {DENTES_SUPERIORES.map(renderDente)}
            </div>
          )}
        </div>

        {/* Linha Oclusal */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="rounded-md border border-gray-200 bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 shadow-2xs">
            Plano Oclusal Médio
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Arcada Inferior */}
        <div>
          <h3 className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Arcada Inferior
          </h3>

          {!disabled ? (
            /* TELA 1 (Edição): Ativa a rolagem horizontal caso falte espaço */
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex justify-between gap-1 min-w-[640px]">
                {DENTES_INFERIORES.map(renderDente)}
              </div>
            </div>
          ) : (
            /* TELA 2 (Consolidado): Empilha os dentes nativamente para caber no espaço */
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1.5 w-full">
              {DENTES_INFERIORES.map(renderDente)}
            </div>
          )}
        </div>
      </div>

      {/* Legendas Livres e Visíveis */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Legenda de Diagnósticos
        </h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <div
              key={status.value}
              className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-2.5 py-1.5 text-xs shadow-2xs"
            >
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${status.color}`} />
              <span className="font-medium text-slate-600 whitespace-nowrap">
                {status.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Alteração de Status */}
      {denteSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Dente selecionado</span>
                <h3 className="text-base font-bold text-slate-800">Condição do Dente {denteSelecionado.replace("D", "")}</h3>
              </div>
              <button 
                onClick={fecharModal} 
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {STATUS_OPTIONS.map((status) => {
                const selecionado = statusAtual === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => alterarStatus(status.value)}
                    className={`
                      w-full flex items-center justify-between
                      rounded-xl border px-3 py-2 text-sm font-medium
                      transition cursor-pointer text-left
                      ${selecionado 
                        ? "border-blue-500 bg-blue-50/40 text-blue-700 shadow-2xs" 
                        : "border-gray-100 bg-slate-50/50 text-slate-700 hover:bg-slate-50 hover:border-gray-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${status.color}`} />
                      <span>{status.label}</span>
                    </div>
                    {selecionado && <CheckCircle2 size={14} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Odontograma;