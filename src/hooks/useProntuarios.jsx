import { useState, useCallback } from 'react';
import * as prontuarioService from '../services/prontuarioService';

export const useProntuarios = () => {
  const [prontuarios, setProntuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarProntuarios = useCallback(async () => {
    setCarregando(true);
    const resultado = await prontuarioService.listarProntuarios();
    if (!resultado.error) setProntuarios(resultado.data);
    setCarregando(false);
  }, []);

  const salvarProntuario = async (dados) => {
    setCarregando(true);
    
    // Se não houver ID, é uma criação. Injetamos o odontograma vazio.
    const payload = dados.id ? dados : {
      ...dados,
      estadoOdontograma: "{}" 
    };

    const resultado = dados.id 
      ? await prontuarioService.atualizarProntuario(payload)
      : await prontuarioService.criarProntuario(payload);
    
    setCarregando(false);
    return resultado;
  };

  const excluirProntuario = async (id) => {
    if (!window.confirm("Excluir este registro permanentemente?")) return;
    setCarregando(true);
    const resultado = await prontuarioService.deletarProntuario(id);
    if (!resultado.error) {
      setProntuarios(prev => prev.filter(p => p.id !== id));
    }
    setCarregando(false);
    return resultado;
  };

  return {
    prontuarios,
    carregando,
    carregarProntuarios,
    salvarProntuario,
    excluirProntuario
  };
};