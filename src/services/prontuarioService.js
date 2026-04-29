import api from "../utils/api";

export const listarProntuarios = async () => {
  try {
    const response = await api.get('/prontuarios');
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Erro ao carregar prontuários." };
  }
};

export const buscarProntuarioPorId = async (id) => {
  try {
    const response = await api.get(`/prontuarios/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Prontuário não encontrado." };
  }
};

export const criarProntuario = async (dados) => {
  try {
    // Seguindo o Postman: pacienteId, alergiasHistorico, estadoOdontograma
    const response = await api.post('/prontuarios', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao criar prontuário.";
    return { error: true, message: msg };
  }
};

export const atualizarProntuario = async (dados) => {
  try {
    // No Postman o PUT envia: { id, alergiasHistorico }
    const response = await api.put('/prontuarios', dados);
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Erro ao atualizar prontuário." };
  }
};

export const deletarProntuario = async (id) => {
  try {
    await api.delete(`/prontuarios/${id}`);
    return { error: false };
  } catch (error) {
    return { error: true, message: "Erro ao excluir prontuário." };
  }
};