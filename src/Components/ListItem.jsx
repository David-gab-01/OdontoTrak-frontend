import React from "react";
import Button from "./Button";

const ListItem = ({ 
  title, 
  description, 
  badgeText, 
  badgeColor = "text-blue-500 bg-blue-50 border-blue-100", 
  onAction, 
  actionLabel = "Ver" 
}) => {
  return (
    <div className="grid grid-cols-12 items-center px-4 py-4 border border-transparent hover:border-gray-100 hover:bg-slate-50/50 rounded-xl transition-all bg-white mb-1">
      
      {/* Coluna 1: Nome/Título e Info secundária */}
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-dentista-primary flex-shrink-0">
          {title ? title.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-dentista-title truncate">{title}</span>
          {description && <span className="text-xs text-dentista-body opacity-60 truncate">{description}</span>}
        </div>
      </div>

      {/* Coluna 2: Badge Central (E-mail, Status, Registro, etc) */}
      <div className="col-span-4 flex justify-center">
        {badgeText && (
          <span className={`px-4 py-1 rounded-full text-[10px] md:text-xs font-bold border truncate ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Coluna 3: Botão de Ação */}
      <div className="col-span-3 flex justify-end">
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default ListItem;