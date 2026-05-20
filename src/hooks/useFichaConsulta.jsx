import { useCallback, useState } from "react";
import * as fichaConsultaService from "../services/fichaConsultaService";
import * as odontogramaService from "../services/odontogramaService";

export const DENTES = [
  "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18",
  "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28",
  "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38",
  "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48",
];

export const criarDentesIniciais = () =>
  DENTES.reduce((acc, dente) => {
    acc[dente] = "SAUDAVEL";
    return acc;
  }, {});

const itensParaDentes = (itens = []) => {
  const estado = criarDentesIniciais();

  itens.forEach((item) => {
    if (item.dente && item.statusDente) {
      estado[item.dente] = item.statusDente;
    }
  });

  return estado;
};

const dentesParaItens = (dentes) =>
  DENTES.map((dente) => ({
    dente,
    statusDente: dentes[dente] || "SAUDAVEL",
  }));

const erroNaoCritico = (resultado) =>
  resultado.status === 400 ||
  resultado.status === 403 ||
  resultado.status === 404 ||
  resultado.message?.toLowerCase().includes("não encontrado") ||
  resultado.message?.toLowerCase().includes("nao encontrado");

const formInicial = {
  queixaPrincipal: "",
  achadoClinico: "",
  alergiasHistorico: "",
  procedimentoRealizado: "",
  material: "",
  observacoes: "",
  orientacoesPaciente: "",
};

export const useFichaConsulta = (id) => {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [agendamento, setAgendamento] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [prontuario, setProntuario] = useState(null);
  const [odontograma, setOdontograma] = useState(null);
  const [dentes, setDentes] = useState(criarDentesIniciais());
  const [form, setForm] = useState(formInicial);

  const atualizarForm = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const carregarDados = useCallback(async () => {
    if (!id) return;

    try {
      setCarregando(true);
      setErro(null);

      const agendamentoResultado =
        await fichaConsultaService.buscarAgendamento(id);

      if (agendamentoResultado.error) {
        setErro(agendamentoResultado.message);
        return;
      }

      const agendamentoData = agendamentoResultado.data;
      setAgendamento(agendamentoData);

      const pacienteId =
        agendamentoData.pacienteId || agendamentoData.paciente?.id;

      if (pacienteId) {
        const pacienteResultado =
          await fichaConsultaService.buscarPaciente(pacienteId);

        if (!pacienteResultado.error) {
          setPaciente(pacienteResultado.data);
        }
      }

      const prontuarioResultado =
        await fichaConsultaService.buscarProntuarioPorAgendamento(id);

      if (!prontuarioResultado.error) {
        const prontuarioData = prontuarioResultado.data;

        setProntuario(prontuarioData);

        setForm((prev) => ({
          ...prev,
          queixaPrincipal: prontuarioData.queixaPrincipal || "",
          achadoClinico: prontuarioData.achadoClinico || "",
          alergiasHistorico: prontuarioData.alergiasHistorico || "",
          procedimentoRealizado: prontuarioData.procedimentoRealizado || "",
          material: prontuarioData.material || "",
          observacoes: prontuarioData.observacoes || "",
          orientacoesPaciente: prontuarioData.orientacoesPaciente || "",
        }));
      } else if (erroNaoCritico(prontuarioResultado)) {
        setProntuario(null);
      } else {
        setErro(prontuarioResultado.message);
      }

      const odontogramaResultado =
        await odontogramaService.buscarPorAgendamento(id);

      if (!odontogramaResultado.error) {
        setOdontograma(odontogramaResultado.data);
        setDentes(itensParaDentes(odontogramaResultado.data?.itens));
      } else if (erroNaoCritico(odontogramaResultado)) {
        setOdontograma(null);
        setDentes(criarDentesIniciais());
      } else {
        setErro(odontogramaResultado.message);
      }

      const status = agendamentoData.statusConsulta;

      if (status === "ATENDIMENTO") {S
        setEtapaAtual(2);
      }

      if (status === "CONCLUIDO") {
        setEtapaAtual(4);
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar ficha da consulta.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  const iniciarAtendimento = async () => {
  const resultado =
    await fichaConsultaService.atualizarStatusAgendamento(
      id,
      "ATENDIMENTO"
    );

  if (resultado.error) {
    return resultado;
  }

  setAgendamento(resultado.data);
  setEtapaAtual(2);

  return resultado;
};

  const salvarOuAtualizarProntuario = async () => {
    const payloadBase = {
      queixaPrincipal: form.queixaPrincipal,
      achadoClinico: form.achadoClinico,
      alergiasHistorico: form.alergiasHistorico,
      procedimentoRealizado: form.procedimentoRealizado,
      material: form.material,
      observacoes: form.observacoes,
      orientacoesPaciente: form.orientacoesPaciente,
    };

    const resultado = prontuario?.id
      ? await fichaConsultaService.atualizarProntuario({
          id: prontuario.id,
          ...payloadBase,
        })
      : await fichaConsultaService.criarProntuario({
          agendamentoId: Number(id),
          ...payloadBase,
        });

    if (!resultado.error) {
      setProntuario(resultado.data);
    }

    return resultado;
  };

  const salvarOuAtualizarOdontograma = async () => {
    const pacienteId =
      agendamento?.pacienteId || agendamento?.paciente?.id;

    const itens = dentesParaItens(dentes);

    const resultado = odontograma?.id
      ? await odontogramaService.atualizarOdontograma({
          id: odontograma.id,
          itens,
        })
      : await odontogramaService.criarOdontograma({
          pacienteId: Number(pacienteId),
          agendamentoId: Number(id),
          itens,
        });

    if (!resultado.error) {
      setOdontograma(resultado.data);
      setDentes(itensParaDentes(resultado.data?.itens));
    }

    return resultado;
  };

  const salvarAvaliacao = async () => {
    const prontuarioResultado =
      await salvarOuAtualizarProntuario();

    if (prontuarioResultado.error) {
      return prontuarioResultado;
    }

    const odontogramaResultado =
      await salvarOuAtualizarOdontograma();

    if (odontogramaResultado.error) {
      return odontogramaResultado;
    }

    setEtapaAtual(3);

    return { error: false };
  };

  const encerrarConsulta = async () => {
    const prontuarioResultado =
      await salvarOuAtualizarProntuario();

    if (prontuarioResultado.error) {
      return prontuarioResultado;
    }

    const odontogramaResultado =
      await salvarOuAtualizarOdontograma();

    if (odontogramaResultado.error) {
      return odontogramaResultado;
    }

    const statusResultado =
      await fichaConsultaService.atualizarStatusAgendamento(
        id,
        "CONCLUIDO"
      );

    if (statusResultado.error) {
      return statusResultado;
    }

    setAgendamento(statusResultado.data);
    setEtapaAtual(4);

    return { error: false };
  };

  return {
    carregando,
    erro,
    etapaAtual,
    setEtapaAtual,
    agendamento,
    paciente,
    prontuario,
    odontograma,
    dentes,
    setDentes,
    form,
    atualizarForm,
    carregarDados,
    iniciarAtendimento,
    salvarAvaliacao,
    encerrarConsulta,
  };
};