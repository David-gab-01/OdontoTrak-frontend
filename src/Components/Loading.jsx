import React from "react";

const Loading = ({ text = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
      </div>

      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
};

export default Loading;