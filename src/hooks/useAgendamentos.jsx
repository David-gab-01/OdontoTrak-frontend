import { useState, useCallback } from 'react';
import * as agendamentoService from '../services/agendamentoService';

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarAgendamentos = useCallback(async () => {
    setCarregando(true);
    const resultado = await agendamentoService.listarAgendamentos();
    if (resultado.error) setErro(resultado.message);
    else setAgendamentos(resultado.data);
    setCarregando(false);
  }, []);

  const carregarAgendamentoPorId = useCallback(async (id) => {
    setCarregando(true);
    const resultado = await agendamentoService.buscarAgendamentoPorId(id);
    if (!resultado.error) setAgendamentoSelecionado(resultado.data);
    setCarregando(false);
  }, []);

  const salvarAgendamento = async (dados) => {
    setCarregando(true);
    const resultado = dados.id 
      ? await agendamentoService.atualizarAgendamento(dados)
      : await agendamentoService.criarAgendamento(dados);
    
    if (!resultado.error) await carregarAgendamentos();
    setCarregando(false);
    return resultado;
  };

  const cancelarAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    setCarregando(true);
    const resultado = await agendamentoService.deletarAgendamento(id);
    if (!resultado.error) {
      setAgendamentos(prev => prev.filter(a => a.id !== id));
    }
    setCarregando(false);
    return resultado;
  };

  return {
    agendamentos,
    agendamentoSelecionado,
    carregando,
    erro,
    carregarAgendamentos,
    carregarAgendamentoPorId,
    salvarAgendamento,
    cancelarAgendamento
  };
};