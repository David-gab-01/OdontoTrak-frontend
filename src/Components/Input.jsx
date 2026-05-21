import React from "react";

const Input = ({
  label,
  placeholder,
  type = "text",
  isTextArea = false,
  isSelect = false,
  rows = 4,
  className = "",
  error = "",
  children,
  ...props
}) => {
  const fieldStyles = `
    px-4 py-3 rounded-xl border bg-white
    text-sm text-gray-700 placeholder-gray-400
    focus:outline-none focus:ring-1
    transition-all shadow-sm w-full
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 focus:border-dentista-primary focus:ring-dentista-primary/20"
    }
  `;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-sm font-bold text-dentista-title ml-1">
          {label}
        </label>
      )}

      {isSelect ? (
        <select className={fieldStyles} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
      ) : isTextArea ? (
        <textarea
          placeholder={placeholder}
          rows={rows}
          className={`${fieldStyles} resize-none`}
          {...props}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={fieldStyles}
          {...props}
        />
      )}

      {error && (
        <span className="text-xs font-medium text-red-500 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;