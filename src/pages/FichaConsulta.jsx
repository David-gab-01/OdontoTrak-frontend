import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton'; // Se tiver o componente de voltar criado

const FichaConsulta = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-clinica shadow-sm border border-gray-100 mt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dentista-title mb-2">
          Detalhamento da Consulta #{id}
        </h1>
        <p className="text-sm text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full font-medium">
          ⚠️ Tela em Desenvolvimento
        </p>
      </div>

      <div className="py-12 border border-dashed border-gray-200 bg-slate-50 rounded-[22px] text-center">
        <p className="text-dentista-body mb-4">
          Você está visualizando o esqueleto da consulta com ID: <strong className="text-dentista-primary">{id}</strong>
        </p>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Em breve, esta tela consumirá os dados do endpoint correspondente.
        </p>
      </div>

      <div className="mt-6">
        <BackButton />
      </div>
    </div>
  );
};

export default FichaConsulta;