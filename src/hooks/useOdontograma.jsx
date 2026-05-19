import { useCallback, useState } from "react";
import * as odontogramaService from "../services/odontogramaService";

export const DENTES = [
  "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18",
  "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28",
  "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38",
  "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48",
];

export const criarEstadoInicialDentes = () => {
  return DENTES.reduce((acc, dente) => {
    acc[dente] = "SAUDAVEL";
    return acc;
  }, {});
};

const converterItensParaEstado = (itens = []) => {
  const estado = criarEstadoInicialDentes();

  itens.forEach((item) => {
    estado[item.dente] = item.statusDente;
  });

  return estado;
};

const converterEstadoParaItens = (estadoDentes) => {
  return DENTES.map((dente) => ({
    dente,
    statusDente: estadoDentes[dente] || "SAUDAVEL",
  }));
};

export const useOdontograma = () => {
  const [odontogramaAtual, setOdontogramaAtual] = useState(null);
  const [dentes, setDentes] = useState(criarEstadoInicialDentes());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarUltimoPorPaciente = useCallback(async (pacienteId) => {
    if (!pacienteId) return;

    setCarregando(true);
    setErro(null);

    const resultado = await odontogramaService.listarPorPaciente(pacienteId);

    if (resultado.error) {
      setErro(resultado.message);
      setOdontogramaAtual(null);
      setDentes(criarEstadoInicialDentes());
      setCarregando(false);
      return;
    }

    const lista = resultado.data || [];
    const ultimo = lista.length > 0 ? lista[lista.length - 1] : null;

    setOdontogramaAtual(ultimo);
    setDentes(ultimo ? converterItensParaEstado(ultimo.itens) : criarEstadoInicialDentes());
    setCarregando(false);
  }, []);

  const carregarPorAgendamento = useCallback(async (agendamentoId) => {
    if (!agendamentoId) return;

    setCarregando(true);
    setErro(null);

    const resultado = await odontogramaService.buscarPorAgendamento(agendamentoId);

    if (resultado.error) {
      setErro(resultado.message);
      setOdontogramaAtual(null);
      setDentes(criarEstadoInicialDentes());
      setCarregando(false);
      return;
    }

    setOdontogramaAtual(resultado.data);
    setDentes(converterItensParaEstado(resultado.data?.itens));
    setCarregando(false);
  }, []);

  const salvarOdontograma = async ({ pacienteId, agendamentoId }) => {
    setCarregando(true);
    setErro(null);

    const itens = converterEstadoParaItens(dentes);

    const dados = odontogramaAtual?.id
      ? {
          id: odontogramaAtual.id,
          itens,
        }
      : {
          pacienteId,
          agendamentoId,
          itens,
        };

    const resultado = odontogramaAtual?.id
      ? await odontogramaService.atualizarOdontograma(dados)
      : await odontogramaService.criarOdontograma(dados);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      setOdontogramaAtual(resultado.data);
      setDentes(converterItensParaEstado(resultado.data?.itens));
    }

    setCarregando(false);
    return resultado;
  };

  return {
    odontogramaAtual,
    dentes,
    setDentes,
    carregando,
    erro,
    carregarUltimoPorPaciente,
    carregarPorAgendamento,
    salvarOdontograma,
  };
};