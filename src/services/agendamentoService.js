import api from "../utils/api";

/**
 * Service para gestão de Agendamentos (Agenda)
 */

// 1. Listar todos os agendamentos (Geralmente usado na visão de Agenda)
export const listarAgendamentos = async () => {
  try {
    const response = await api.get('/agendamentos');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao buscar agendamentos.";
    return { error: true, message: msg };
  }
};

// 2. Buscar um agendamento específico (Para carregar dados na edição)
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
// Espera: { pacienteId, profissionalId, dataInicio, dataFim, statusConsulta }
export const criarAgendamento = async (dados) => {
  try {
    const response = await api.post('/agendamentos', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao processar agendamento.";
    return { error: true, message: msg };
  }
};

// 4. Atualizar Agendamento (Mudar horário ou Status)
export const atualizarAgendamento = async (dados) => {
  try {
    const response = await api.put('/agendamentos', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao atualizar agendamento.";
    return { error: true, message: msg };
  }
};

// 5. Deletar (Cancelar) Agendamento
export const deletarAgendamento = async (id) => {
  try {
    await api.delete(`/agendamentos/${id}`);
    return { error: false };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao remover agendamento.";
    return { error: true, message: msg };
  }
};