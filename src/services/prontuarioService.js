import api from "../utils/api";


// Service para gestão de Prontuários

// GET /prontuarios
export const listarProntuarios = async () => {
  try {
    const response = await api.get('/prontuarios');
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Erro ao carregar prontuários." };
  }
};


// GET /prontuarios/{id}
export const buscarProntuarioPorId = async (id) => {
  try {
    const response = await api.get(`/prontuarios/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Prontuário não encontrado." };
  }
};

// GET /prontuarios/paciente/{pacienteId}
export const buscarProntuariosPorPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/prontuarios/paciente/${pacienteId}`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, message: "Erro ao buscar histórico do paciente." };
  }
};

// GET /prontuarios/agendamento/{agendamentoId}
export const buscarProntuarioPorAgendamento = async (agendamentoId) => {
  try {
    const response = await api.get(`/prontuarios/agendamento/${agendamentoId}`);
    return { error: false, data: response.data };
  } catch (error) {
    // Retorna o erro estruturado para a tela saber se precisa fazer um POST
    return { error: true, status: error.response?.status, message: "Prontuário não iniciado para esta consulta." };
  }
};


// POST /prontuarios
export const criarProntuario = async (dados) => {
  try {
    const response = await api.post('/prontuarios', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao criar prontuário.";
    return { error: true, message: msg };
  }
};

// PUT /prontuarios
export const atualizarProntuario = async (dados) => {
  try {
    const response = await api.put('/prontuarios', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao atualizar prontuário.";
    return { error: true, message: msg };
  }
};


// DELETE /prontuarios/{id}
export const deletarProntuario = async (id) => {
  try {
    await api.delete(`/prontuarios/${id}`);
    return { error: false };
  } catch (error) {
    return { error: true, message: "Erro ao excluir prontuário." };
  }
};