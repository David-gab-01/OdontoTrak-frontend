import React from 'react';
import { BarChart3, Wrench } from 'lucide-react';

const ModuloEmDesenvolvimento = ({ titulo, descricao }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[28rem]">
        
        <div className="relative mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-gray-100">
          <BarChart3 size={36} className="text-dentista-primary opacity-40 absolute" />
          <Wrench size={24} className="text-dentista-primary animate-pulse absolute translate-x-4 -translate-y-4" />
        </div>

        {/* Textos */}
        <span className="text-[11px] font-bold tracking-widest text-dentista-primary uppercase bg-blue-50/60 px-3 py-1 rounded-full mb-3">
          Em Breve
        </span>
        
        <h2 className="text-2xl md:text-3xl font-bold text-dentista-title mb-3">
          {titulo}
        </h2>

        <p className="text-sm md:text-base text-dentista-body max-w-md mb-8 leading-relaxed">
          {descricao || "Estamos melhorando o sistema! Em breve este módulo estará totalmente disponível para otimizar a gestão da sua clínica."}
        </p>

        {/* Linha de Progresso Ilustrativa */}
        <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden mb-8">
          <div className="bg-dentista-primary h-full w-2/3 rounded-full animate-infinite animate-duration-[3000ms]" />
        </div>

      </div>
    </div>
  );
};

export default ModuloEmDesenvolvimento;