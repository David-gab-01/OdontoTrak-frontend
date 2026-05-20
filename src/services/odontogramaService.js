import api from "../utils/api";

const tratarErro = (error, mensagemPadrao) => {
  return {
    error: true,
    message: error.response?.data?.message || mensagemPadrao,
    status: error.response?.status,
  };
};

export const listarPorPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/odontogramas/paciente/${pacienteId}`);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao carregar odontogramas.");
  }
};

export const buscarPorAgendamento = async (agendamentoId) => {
  try {
    const response = await api.get(`/odontogramas/agendamento/${agendamentoId}`);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao buscar odontograma.");
  }
};

export const criarOdontograma = async (dados) => {
  try {
    const response = await api.post("/odontogramas", dados);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao salvar odontograma.");
  }
};

export const atualizarOdontograma = async (dados) => {
  try {
    const response = await api.put("/odontogramas", dados);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao atualizar odontograma.");
  }
};

export const deletarOdontograma = async (id) => {
  try {
    await api.delete(`/odontogramas/${id}`);
    return { error: false };
  } catch (error) {
    return tratarErro(error, "Erro ao excluir odontograma.");
  }
};