import React, { useState } from "react";

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
  { value: "AUSENTE", label: "Ausente", color: "bg-gray-400" },
  { value: "PROTETICO", label: "Protético", color: "bg-purple-500" },
  { value: "IMPLANTE", label: "Implante", color: "bg-yellow-500" },
];

const statusStyles = {
  SAUDAVEL: {
    card: "border-emerald-500/40 bg-emerald-500/10",
    tooth: "bg-emerald-500",
    text: "text-emerald-400",
  },
  CARIADO: {
    card: "border-red-500/40 bg-red-500/10",
    tooth: "bg-red-500",
    text: "text-red-400",
  },
  RESTAURADO: {
    card: "border-blue-500/40 bg-blue-500/10",
    tooth: "bg-blue-500",
    text: "text-blue-400",
  },
  AUSENTE: {
    card: "border-gray-500/40 bg-gray-500/10",
    tooth: "bg-gray-400",
    text: "text-gray-300",
  },
  PROTETICO: {
    card: "border-purple-500/40 bg-purple-500/10",
    tooth: "bg-purple-500",
    text: "text-purple-400",
  },
  IMPLANTE: {
    card: "border-yellow-500/40 bg-yellow-500/10",
    tooth: "bg-yellow-500",
    text: "text-yellow-300",
  },
};

const Odontograma = ({ dentes = {}, onChange, disabled = false }) => {
  const [denteSelecionado, setDenteSelecionado] = useState(null);

  const fecharModal = () => {
    setDenteSelecionado(null);
  };

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
          group
          rounded-2xl
          border
          p-2
          text-center
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-1
          hover:shadow-lg
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${style.card}
        `}
      >
        <div className="mb-2 flex justify-center">
          <div
            className={`
              h-10
              w-8
              rounded-b-3xl
              rounded-t-xl
              shadow-inner
              transition-all
              duration-300
              ${style.tooth}
            `}
          />
        </div>

        <p className={`text-xs font-bold ${style.text}`}>
          {dente.replace("D", "")}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {STATUS_OPTIONS.find((item) => item.value === status)?.label}
        </p>
      </button>
    );
  };

  const statusAtual = dentes[denteSelecionado] || "SAUDAVEL";

  return (
    <div className="rounded-clinica border border-gray-800 bg-[#050816] p-6 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Odontograma</h2>
        <p className="mt-1 text-sm text-gray-400">
          Clique em um dente para alterar o status clínico.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-[#0B1120] p-6">
        <div className="mb-10">
          <h3 className="mb-5 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
            Arcada Superior
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8 xl:grid-cols-16">
            {DENTES_SUPERIORES.map(renderDente)}
          </div>
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="rounded-full border border-gray-700 bg-[#111827] px-4 py-1 text-xs font-semibold text-gray-400">
            Linha média
          </span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <div>
          <h3 className="mb-5 text-center text-sm font-semibold uppercase tracking-wide text-gray-300">
            Arcada Inferior
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8 xl:grid-cols-16">
            {DENTES_INFERIORES.map(renderDente)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-800 bg-[#0B1120] p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
          Legenda dos Status
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATUS_OPTIONS.map((status) => (
            <div
              key={status.value}
              className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#111827] px-3 py-3"
            >
              <span className={`h-4 w-4 rounded-full ${status.color}`} />
              <span className="text-sm font-medium text-gray-200">
                {status.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {denteSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-700 bg-[#0B1120] p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-400">Alterar status do dente</p>
              <h3 className="mt-1 text-3xl font-bold text-white">
                {denteSelecionado.replace("D", "")}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {STATUS_OPTIONS.map((status) => {
                const selecionado = statusAtual === status.value;

                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => alterarStatus(status.value)}
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-gray-800
                      ${
                        selecionado
                          ? "border-white bg-gray-800"
                          : "border-gray-700 bg-[#111827]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-4 w-4 rounded-full ${status.color}`} />
                      <span className="font-semibold text-white">
                        {status.label}
                      </span>
                    </div>

                    {selecionado && (
                      <span className="text-xs font-semibold text-emerald-400">
                        Atual
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={fecharModal}
              className="mt-5 w-full rounded-2xl border border-gray-700 bg-transparent px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Odontograma;