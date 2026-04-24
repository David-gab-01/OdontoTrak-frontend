import React from "react";
import { Search } from "lucide-react";

const SearchInput = ({ 
  placeholder = "Buscar...", 
  buttonText = "Search", 
  showButton = true, 
  className = "",
  fullWidth = false,
  ...props 
}) => {
  return (
    <div className={`flex items-center gap-3 ${fullWidth ? 'w-full' : 'max-w-lg'} ${className}`}>
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 bg-white
                     text-sm text-gray-700 placeholder-gray-400
                     focus:outline-none focus:border-dentista-primary transition-colors shadow-sm"
          {...props}
        />
        {/* Ícone de lupa fixo dentro do input */}
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
        />
      </div>

      {showButton && (
        <button
          className="px-6 py-4 rounded-xl bg-dentista-primary text-white text-sm font-medium
                     hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default SearchInput;