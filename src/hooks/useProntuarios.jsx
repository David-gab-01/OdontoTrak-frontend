import { useState, useCallback } from 'react';
import * as prontuarioService from '../services/prontuarioService';

export const useProntuarios = () => {
  const [prontuarios, setProntuarios] = useState([]); // Lista geral
  const [historicoPaciente, setHistoricoPaciente] = useState([]); // [NOVO] Histórico clínico
  const [prontuarioAtual, setProntuarioAtual] = useState(null); // [NOVO] Foco da consulta ativa
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carrega todos os prontuários da clínica
  const carregarProntuarios = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await prontuarioService.listarProntuarios();
    if (!resultado.error) setProntuarios(resultado.data);
    else setErro(resultado.message);
    setCarregando(false);
  }, []);

  // [NOVO] Carrega a linha do tempo/histórico de um paciente específico
  const carregarHistoricoPaciente = useCallback(async (pacienteId) => {
    if (!pacienteId) return;
    setCarregando(true);
    setErro(null);
    const resultado = await prontuarioService.buscarProntuariosPorPaciente(pacienteId);
    if (!resultado.error) setHistoricoPaciente(resultado.data || []);
    else setErro(resultado.message);
    setCarregando(false);
  }, []);

  // [NOVO] Carrega ou verifica o prontuário atrelado a este atendimento
  const carregarProntuarioPorAgendamento = useCallback(async (agendamentoId) => {
    if (!agendamentoId) return null;
    setCarregando(true);
    setErro(null);
    const resultado = await prontuarioService.buscarProntuarioPorAgendamento(agendamentoId);
    
    if (!resultado.error) {
      setProntuarioAtual(resultado.data);
    } else {
      setProntuarioAtual(null);
      // Não joga erro na tela se for apenas um 404 de "não criado ainda"
      if (resultado.status !== 404) setErro(resultado.message);
    }
    setCarregando(false);
    return resultado;
  }, []);

  // Cria ou atualiza unificado
  const salvarProntuario = async (dados) => {
    setCarregando(true);
    setErro(null);
    
    // Adaptador de Payload: Garante que 'materialUsado' converta para 'material' antes de ir para o backend
    const payload = {
      ...dados,
      material: dados.material || dados.materialUsado || ""
    };
    
    // Remove chaves que pertencem apenas à resposta para limpar o JSON enviado
    delete payload.materialUsado; 
    delete payload.dataUltimaAtualizacao;
    delete payload.nomePaciente;

    const resultado = dados.id 
      ? await prontuarioService.atualizarProntuario(payload)
      : await prontuarioService.criarProntuario(payload);
    
    if (!resultado.error) {
      setProntuarioAtual(resultado.data);
    } else {
      setErro(resultado.message);
    }
    
    setCarregando(false);
    return resultado;
  };

  const excluirProntuario = async (id) => {
    if (!window.confirm("Excluir este prontuário permanentemente?")) return { error: true };
    setCarregando(true);
    const resultado = await prontuarioService.deletarProntuario(id);
    if (!resultado.error) {
      setProntuarios(prev => prev.filter(p => p.id !== id));
      if (prontuarioAtual?.id === id) setProntuarioAtual(null);
    } else {
      setErro(resultado.message);
    }
    setCarregando(false);
    return resultado;
  };

  return {
    prontuarios,
    historicoPaciente,
    prontuarioAtual,
    carregando,
    erro,
    carregarProntuarios,
    carregarHistoricoPaciente,
    carregarProntuarioPorAgendamento,
    salvarProntuario,
    excluirProntuario
  };
};