import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className={`flex items-center gap-2 text-dentista-body hover:text-dentista-primary transition-colors mb-6 font-medium text-sm ${className}`}
    >
      <ArrowLeft size={18} /> 
      {label}
    </button>
  );
};

export default BackButton;