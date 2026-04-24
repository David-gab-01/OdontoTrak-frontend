import React from "react";

const ListContainer = ({ 
  title, 
  columns = { col1: "Informação", col2: "Detalhes", col3: "Ação" }, 
  children // IMPORTANTE: Agora ele recebe os itens por aqui
}) => {
  return (
    <div className="mt-8 mb-10">
      {title && <h1 className="text-2xl font-bold text-dentista-title mb-6">{title}</h1>}

      <div className="bg-white p-6 rounded-clinica shadow-sm border border-gray-100">
        
        {/* Cabeçalho que garante o alinhamento das colunas 5, 4 e 3 */}
        <div className="grid grid-cols-12 px-4 mb-4 text-xs font-bold text-dentista-body uppercase tracking-widest opacity-50">
          <div className="col-span-5">{columns.col1}</div>
          <div className="col-span-4 text-center">{columns.col2}</div>
          <div className="col-span-3 text-right">{columns.col3}</div>
        </div>

        {/* Espaço onde os ListItems serão renderizados */}
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ListContainer;