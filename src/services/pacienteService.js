import api from "../utils/api";

/**
 * Service para gestão de Pacientes
 * Padronizamos o retorno como { error, data, message }
 */

// 1. Listar todos os pacientes
export const listarPacientes = async () => {
  try {
    const response = await api.get('/pacientes');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao carregar lista de pacientes.";
    return { error: true, message: msg };
  }
};

// 2. Buscar paciente específico por ID
export const buscarPacientePorId = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || `Erro ao buscar paciente com ID ${id}.`;
    return { error: true, message: msg };
  }
};

// 3. Criar novo paciente
export const criarPaciente = async (dadosPaciente) => {
  try {
    const response = await api.post('/pacientes', dadosPaciente);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao cadastrar paciente.";
    return { error: true, message: msg };
  }
};

// 4. Atualizar paciente existente
export const atualizarPaciente = async (id, dadosAtualizados) => {
  try {
    const response = await api.put(`/pacientes/${id}`, dadosAtualizados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao atualizar dados do paciente.";
    return { error: true, message: msg };
  }
};

// 5. Deletar paciente
export const deletarPaciente = async (id) => {
  try {
    await api.delete(`/pacientes/${id}`);
    return { error: false, message: "Paciente removido com sucesso." };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao excluir paciente.";
    return { error: true, message: msg };
  }
};