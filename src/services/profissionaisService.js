import api from "../utils/api";

// Lista de requisições relacionadas a profissionais


// Lista todos os profissionais cadastrados no sistema, retornando um array de objetos
export const listarProfissionais = async () => {
  try {
    const response = await api.get('/profissionais');
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao carregar profissionais.";
    return { error: true, message: msg };
  }
};

// Busca um profissional específico por ID, retornando um objeto com os detalhes do profissional
export const buscarProfissionalPorId = async (id) => {
  try {
    const response = await api.get(`/profissionais/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao buscar profissional.";
    return { error: true, message: msg };
  }
};

// Cria um novo profissional
export const criarProfissional = async (dados) => {
  try {
    // Conforme o Postman: nome, email, senha, cpf, telefone, registroProfissional, perfis
    const response = await api.post('/profissionais', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao criar profissional.";
    return { error: true, message: msg };
  }
};

// Atualiza um profissional existente
export const atualizarProfissional = async (dados) => {
  try {
    const response = await api.put('/profissionais', dados);
    return { error: false, data: response.data };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao atualizar profissional.";
    return { error: true, message: msg };
  }
};

// Exclui um profissional por ID
export const deletarProfissional = async (id) => {
  try {
    await api.delete(`/profissionais/${id}`);
    return { error: false };
  } catch (error) {
    const msg = error.response?.data?.message || "Erro ao excluir profissional.";
    return { error: true, message: msg };
  }
};  