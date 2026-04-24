import React from "react";

const Input = ({
  label,
  placeholder,
  type = "text",
  isTextArea = false,
  isSelect = false,
  rows = 4,
  className = "",
  children,
  ...props 
}) => {


  const fieldStyles = `
    px-4 py-3 rounded-xl border border-gray-200 bg-white
    text-sm text-gray-700 placeholder-gray-400
    focus:outline-none focus:border-dentista-primary focus:ring-1 focus:ring-dentista-primary/20
    transition-all shadow-sm w-full disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-sm font-bold text-dentista-title ml-1">
          {label}
        </label>
      )}

      {/* Lógica de Renderização Condicional */}
      {(() => {

        if (isSelect) {
          return (
            <select className={fieldStyles} {...props}>
              {placeholder && <option value="">{placeholder}</option>}
              {children}
            </select>
          );
        }

        if (isTextArea) {
          return (
            <textarea
              placeholder={placeholder}
              rows={rows}
              className={`${fieldStyles} resize-none`}
              {...props}
            />
          );
        }

        return (
          <input
            type={type}
            placeholder={placeholder}
            className={fieldStyles}
            {...props}
          />
        );
      })()}
    </div>
  );
};

export default Input;
