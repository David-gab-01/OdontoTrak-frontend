import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Anel externo */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />

        {/* Anel interno */}
        <div
          className="absolute w-10 h-10 rounded-full border-4 border-gray-700 border-b-purple-500 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.6s" }}
        />

        {/* Ponto central */}
        <div className="absolute w-2 h-2 rounded-full bg-white" />
      </div>

      {/* Texto */}
      <p className="mt-6 text-gray-400 text-sm tracking-widest uppercase animate-pulse">
        Carregando...
      </p>

      {/* Barra de progresso animada */}
      <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default Loading;
