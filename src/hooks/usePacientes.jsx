import { useState, useCallback } from 'react';
import * as pacienteService from '../services/pacienteService';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Função para listar todos 
  const carregarPacientes = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await pacienteService.listarPacientes();
    
    if (resultado.error) {
      setErro(resultado.message);
    } else {
      setPacientes(resultado.data);
    }
    setCarregando(false);
  }, []);

  // Função para buscar um único paciente
  const carregarPacientePorId = useCallback(async (id) => {
    setCarregando(true);
    setErro(null);
    const resultado = await pacienteService.buscarPacientePorId(id);
    
    if (resultado.error) {
      setErro(resultado.message);
    } else {
      setPacienteSelecionado(resultado.data);
    }
    setCarregando(false);
  }, []);

  // Função para salvar (novo ou edição)
  const salvarPaciente = async (dados) => {
    setCarregando(true);
    let resultado;
    
    if (dados.id) {
      resultado = await pacienteService.atualizarPaciente(dados.id, dados);
    } else {
      resultado = await pacienteService.criarPaciente(dados);
    }

    if (!resultado.error) {
      await carregarPacientes(); // Atualiza a lista local após salvar
    }
    
    setCarregando(false);
    return resultado; 
  };

  // Função para excluir
  const excluirPaciente = async (id) => {
    if (!window.confirm("Deseja realmente excluir este paciente?")) return;
    
    setCarregando(true);
    const resultado = await pacienteService.deletarPaciente(id);
    
    if (!resultado.error) {
      setPacientes(prev => prev.filter(p => p.id !== id));
    } else {
      alert(resultado.message);
    }
    setCarregando(false);
  };

  return {
    pacientes,
    pacienteSelecionado,
    carregando,
    erro,
    carregarPacientes,
    carregarPacientePorId,
    salvarPaciente,
    excluirPaciente
  };
};