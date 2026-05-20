import api from "../utils/api";

const tratarErro = (error, mensagemPadrao) => ({
  error: true,
  message: error.response?.data?.message || mensagemPadrao,
  status: error.response?.status,
});

export const buscarAgendamento = async (id) => {
  try {
    const response = await api.get(`/agendamentos/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao buscar agendamento.");
  }
};

export const buscarPaciente = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao buscar paciente.");
  }
};

export const atualizarStatusAgendamento = async (id, statusConsulta) => {
  try {
    const body = {
      id: Number(id),
      statusConsulta,
    };

    console.log("Body enviado no PUT /agendamentos:", body);

    const response = await api.put("/agendamentos", body);

    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    console.log("Erro do backend:", error.response?.data);

    return tratarErro(
      error,
      "Erro ao atualizar status do agendamento."
    );
  }
};

export const buscarProntuarioPorAgendamento = async (agendamentoId) => {
  try {
    const response = await api.get(`/prontuarios/agendamento/${agendamentoId}`);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Prontuário não encontrado.");
  }
};

export const criarProntuario = async (dados) => {
  try {
    const response = await api.post("/prontuarios", dados);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao criar prontuário.");
  }
};

export const atualizarProntuario = async (dados) => {
  try {
    const response = await api.put("/prontuarios", dados);
    return { error: false, data: response.data };
  } catch (error) {
    return tratarErro(error, "Erro ao atualizar prontuário.");
  }
};