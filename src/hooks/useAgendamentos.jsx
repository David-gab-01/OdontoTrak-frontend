import { useState, useCallback } from "react";
import * as agendamentoService from "../services/agendamentoService";

export const useAgendamentos = () => {
  // agendamentos representará o contexto específico do momento (Filtrados, por Paciente, do Dentista Logado, etc.)
  const [agendamentos, setAgendamentos] = useState([]);

  // [NOVO] Mantém a lista completa e imutável da clínica inteira para a recepção monitorar e filtrar
  const [todosAgendamentos, setTodosAgendamentos] = useState([]);

  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [resumoDashboard, setResumoDashboard] = useState(null); // Estatísticas do Dentista Logado
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Lista global de toda a clínica (Perfeito para o Dashboard da Clínica/Recepção)
  const carregarTodosAgendamentos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await agendamentoService.listarAgendamentos();
    if (resultado.error) {
      setErro(resultado.message);
      setTodosAgendamentos([]);
    } else {
      setTodosAgendamentos(resultado.data || []);
    }
    setCarregando(false);
  }, []);

  // Legado mantido para compatibilidade caso alguma listagem utilize
  const carregarAgendamentos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await agendamentoService.listarAgendamentos();
    if (resultado.error) setErro(resultado.message);
    else setAgendamentos(resultado.data || []);
    setCarregando(false);
  }, []);

  // Carrega o resumo estatístico para o Dashboard do Dentista (GET /agendamentos/meus/resumo)
  const carregarResumoDashboard = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    const resultado = await agendamentoService.buscarResumoMeuDashboard();

    // LOG CRUCIAL: Vai mostrar o que veio do Service
    console.log("RESPOSTA DO SERVICE RESUMO:", resultado);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      // Se o backend não envelopar em 'data', tenta pegar o resultado direto
      const dadosFinais = resultado.data || resultado;
      console.log("Dados que serão salvos no estado:", dadosFinais);
      setResumoDashboard(dadosFinais);
    }

    setCarregando(false);
  }, []);

  // Lista as consultas exclusivas do Dentista logado 
  const carregarMeusAgendamentos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await agendamentoService.listarMeusAgendamentos();
    if (resultado.error) setErro(resultado.message);
    else setAgendamentos(resultado.data || []);
    setCarregando(false);
  }, []);

  // Histórico de um Paciente Específico 
  const carregarAgendamentosPorPaciente = useCallback(async (pacienteId) => {
    if (!pacienteId) return;
    setCarregando(true);
    setErro(null);
    const resultado =
      await agendamentoService.listarAgendamentosPorPaciente(pacienteId);
    if (resultado.error) setErro(resultado.message);
    else setAgendamentos(resultado.data || []);
    setCarregando(false);
  }, []);

  // Agenda de um Dentista específico 
  const carregarAgendamentosPorProfissional = useCallback(
    async (profissionalId) => {
      if (!profissionalId) return;
      setCarregando(true);
      setErro(null);
      const resultado =
        await agendamentoService.listarAgendamentosPorProfissional(
          profissionalId,
        );
      if (resultado.error) setErro(resultado.message);
      else setAgendamentos(resultado.data || []);
      setCarregando(false);
    },
    [],
  );

  // Busca detalhes de uma única consulta
  const carregarAgendamentoPorId = useCallback(async (id) => {
    if (!id) return;
    setCarregando(true);
    setErro(null);
    const resultado = await agendamentoService.buscarAgendamentoPorId(id);
    if (resultado.error) setErro(resultado.message);
    else setAgendamentoSelecionado(resultado.data);
    setCarregando(false);
  }, []);

  // Cria ou atualiza uma consulta na clínica
  const salvarAgendamento = async (dados) => {
    setCarregando(true);
    setErro(null);
    const resultado = dados.id
      ? await agendamentoService.atualizarAgendamento(dados)
      : await agendamentoService.criarAgendamento(dados);

    if (!resultado.error) {
      // Atualiza ambas as listas locais para manter a consistência em tempo real na interface
      await carregarTodosAgendamentos();
    }
    setCarregando(false);
    return resultado;
  };

  // Cancela ou remove uma consulta
  const cancelarAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?"))
      return { error: true };
    setCarregando(true);
    setErro(null);
    const resultado = await agendamentoService.deletarAgendamento(id);
    if (!resultado.error) {
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
      setTodosAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } else {
      setErro(resultado.message);
    }
    setCarregando(false);
    return resultado;
  };

  return {
    agendamentos,
    todosAgendamentos, 
    agendamentoSelecionado,
    resumoDashboard,
    carregando,
    erro,
    carregarAgendamentos,
    carregarTodosAgendamentos, 
    carregarResumoDashboard,
    carregarMeusAgendamentos,
    carregarAgendamentosPorPaciente,
    carregarAgendamentosPorProfissional,
    carregarAgendamentoPorId,
    salvarAgendamento,
    cancelarAgendamento,
  };
};
