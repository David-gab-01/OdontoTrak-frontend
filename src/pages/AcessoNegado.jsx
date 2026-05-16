import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/Button';

const AcessoNegado = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ShieldAlert size={52} />
      </div>
      
      <h1 className="text-3xl font-bold text-dentista-title mb-2">
        Acesso Restrito
      </h1>
      
      <p className="text-dentista-body max-w-md mb-8 opacity-70">
        Seu perfil atual não possui permissão para visualizar este módulo. 
        Caso precise de acesso, solicite ao administrador da clínica.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          icon={ArrowLeft} 
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        
        <Button 
          variant="outline"
          icon={Home} 
          onClick={() => navigate('/dashboard')}
        >
          Painel Principal
        </Button>
      </div>
    </div>
  );
};

export default AcessoNegado;