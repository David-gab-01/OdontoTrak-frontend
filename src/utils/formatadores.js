export const formatarCPF = (cpf = '') => {
  const apenasNumeros = cpf.replace(/\D/g, '');

  return apenasNumeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatarTelefone = (telefone = '') => {
  const apenasNumeros = telefone.replace(/\D/g, '');

  if (apenasNumeros.length <= 10) {
    return apenasNumeros.replace(
      /(\d{2})(\d{4})(\d{0,4})/,
      '($1) $2-$3'
    );
  }

  return apenasNumeros.replace(
    /(\d{2})(\d{5})(\d{0,4})/,
    '($1) $2-$3'
  );
};

export const formatarData = (data) => {
  if (!data) return 'Não informado';

  return new Date(data).toLocaleDateString('pt-BR');
};

export const formatarDataHora = (data) => {
  if (!data) return 'Data indisponível';

  return new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const formatarMoeda = (valor = 0) => {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatarStatus = (status = '') => {
  return status
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
};

export const pegarIniciais = (nome = '') => {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');
};