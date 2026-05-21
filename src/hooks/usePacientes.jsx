import { useState, useCallback } from 'react';
import * as pacienteService from '../services/pacienteService';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarPacientes = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await pacienteService.listarPacientes();
    if (resultado.error) setErro(resultado.message);
    else setPacientes(resultado.data);
    setCarregando(false);
  }, []);

  const carregarPacientePorId = useCallback(async (id) => {
    setCarregando(true);
    setErro(null);
    const resultado = await pacienteService.buscarPacientePorId(id);
    if (resultado.error) setErro(resultado.message);
    else setPacienteSelecionado(resultado.data);
    setCarregando(false);
  }, []);

  const salvarPaciente = async (dados) => {
    setCarregando(true);
    let resultado = dados.id
      ? await pacienteService.atualizarPaciente(dados.id, dados)
      : await pacienteService.criarPaciente(dados);

    if (!resultado.error) await carregarPacientes();
    setCarregando(false);
    return resultado; 
  };

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