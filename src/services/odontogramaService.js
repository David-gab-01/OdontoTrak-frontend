import api from "../utils/api";

export const listarPorPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/odontogramas/paciente/${pacienteId}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao carregar odontogramas.";
    return { error: true, message: msg };
  }
};

export const buscarPorAgendamento = async (agendamentoId) => {
  try {
    const response = await api.get(`/odontogramas/agendamento/${agendamentoId}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao buscar odontograma.";
    return { error: true, message: msg };
  }
};

export const criarOdontograma = async (dados) => {
  try {
    const response = await api.post("/odontogramas", dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao salvar odontograma.";
    return { error: true, message: msg };
  }
};

export const atualizarOdontograma = async (dados) => {
  try {
    const response = await api.put("/odontogramas", dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao atualizar odontograma.";
    return { error: true, message: msg };
  }
};

export const deletarOdontograma = async (id) => {
  try {
    await api.delete(`/odontogramas/${id}`);
    return { error: false };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao excluir odontograma.";
    return { error: true, message: msg };
  }
};