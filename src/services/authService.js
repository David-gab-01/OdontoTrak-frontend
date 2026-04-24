import api from "../utils/api";

export const fazerLogin = async (email, senha, loginContexto) => {
  try {
    const response = await api.post('/profissionais/login', { email, senha });
    const { token } = response.data;

    if (token) {
      // Passa o token para o contexto processar
      loginContexto(token);
      return { error: false, data: response.data };
    }
    
    return { error: true, message: "Token não recebido." };

  } catch (error) {
    const status = error.response?.status;
    const mensagemBackend = error.response?.data?.message || error.response?.data?.error;

    if (status === 400) {
      return { error: true, message: "E-mail ou senha incorretos." };
    } else if (status === 403) {
      return { error: true, message: "Acesso negado pelo servidor." };
    }
    
    return { error: true, message: "Erro na conexão com o servidor. Tente mais tarde." };
  }
};