import api from "../utils/api";

/**
 * Service para gestão de Agendamentos (Agenda)
 */

// 1. Listar todos os agendamentos (Visão Geral da Clínica para Admin/Recepção)
export const listarAgendamentos = async () => {
  try {
    const response = await api.get('/agendamentos');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao buscar agendamentos.";
    return { error: true, message: msg };
  }
};

// Dashboard Estatístico do Dentista Logado
export const buscarResumoMeuDashboard = async () => {
  try {
    const response = await api.get('/meus/resumo');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao carregar resumo estatístico.";
    return { error: true, message: msg };
  }
};

// Consultas do Dentista Logado ("Minhas Consultas")
export const listarMeusAgendamentos = async () => {
  try {
    const response = await api.get('/agendamentos/meus');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao buscar seus agendamentos.";
    return { error: true, message: msg };
  }
};

// Histórico Completo de um Paciente Específico
export const listarAgendamentosPorPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/agendamentos/paciente/${pacienteId}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao carregar histórico do paciente.";
    return { error: true, message: msg };
  }
};

// Ver Agenda de um Dentista Específico (Para Admin / Recepção)
export const listarAgendamentosPorProfissional = async (profissionalId) => {
  try {
    const response = await api.get(`/agendamentos/profissional/${profissionalId}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao carregar agenda do profissional.";
    return { error: true, message: msg };
  }
};

// 2. Buscar um agendamento específico por ID
export const buscarAgendamentoPorId = async (id) => {
  try {
    const response = await api.get(`/agendamentos/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Agendamento não encontrado.";
    return { error: true, message: msg };
  }
};

// 3. Criar Novo Agendamento
export const criarAgendamento = async (dados) => {
  try {
    const response = await api.post('/agendamentos', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao processar agendamento.";
    return { error: true, message: msg };
  }
};

// 4. Atualizar Agendamento (Reagendar ou Mudar Status)
export const atualizarAgendamento = async (dados) => {
  try {
    const response = await api.put('/agendamentos', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao atualizar agendamento.";
    return { error: true, message: msg };
  }
};

// 5. Deletar (Cancelar - Soft Delete) Agendamento
export const deletarAgendamento = async (id) => {
  try {
    await api.delete(`/agendamentos/${id}`);
    return { error: false };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao remover agendamento.";
    return { error: true, message: msg };
  }
};