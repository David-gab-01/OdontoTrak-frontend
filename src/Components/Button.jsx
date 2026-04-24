import React from "react";
const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  icon: Icon, // Permite passar um ícone do Lucide
  ...props 
}) => {
  // Estilos base que todos os botões terão
    const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm active:scale-95 whitespace-nowrap";;
  
  // Dicionário de variantes conforme o seu layout
  const variants = {
    primary: "bg-dentista-primary text-white hover:bg-blue-700 shadow-md shadow-blue-100",
    secondary: "bg-dentista-secondary text-white hover:opacity-90 shadow-md shadow-cyan-100",
    accent: "bg-dentista-accent text-white hover:opacity-90 shadow-md shadow-orange-100",
    outline: "border border-dentista-primary text-dentista-primary hover:bg-blue-50",
    ghost: "text-dentista-body hover:bg-gray-100 border border-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;