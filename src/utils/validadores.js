export const apenasNumeros = (valor = '') => {
  return valor.replace(/\D/g, '');
};

export const validarEmail = (email = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validarCPF = (cpf = '') => {
  const numeros = apenasNumeros(cpf);

  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(numeros[i]) * (10 - i);
  }

  let digito1 = 11 - (soma % 11);
  if (digito1 >= 10) digito1 = 0;

  if (digito1 !== Number(numeros[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(numeros[i]) * (11 - i);
  }

  let digito2 = 11 - (soma % 11);
  if (digito2 >= 10) digito2 = 0;

  return digito2 === Number(numeros[10]);
};

export const validarTelefone = (telefone = '') => {
  const numeros = apenasNumeros(telefone);
  return numeros.length === 10 || numeros.length === 11;
};

export const validarCampoObrigatorio = (valor) => {
  return (
    valor !== null &&
    valor !== undefined &&
    String(valor).trim() !== ''
  );
};

export const validarCRO = (cro = '') => {
  return String(cro).trim().length >= 3;
};

export const validarSenha = (senha = '') => {
  return senha.length >= 6;
};

export const validarNome = (nome = '') => {
  return String(nome).trim().length >= 3;
};

export const validarDataNascimento = (data = '') => {
  if (!data) return false;

  const dataInformada = new Date(data);
  const hoje = new Date();

  return dataInformada < hoje;
};

export const validarConfirmacaoSenha = (senha = '', confirmarSenha = '') => {
  return senha === confirmarSenha;
};