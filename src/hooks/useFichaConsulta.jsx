import { useState, useCallback } from "react";
import * as agendamentoService from "../services/agendamentoService"; 
import * as prontuarioService from "../services/prontuarioService";   
import * as pacienteService from "../services/pacienteService"; 

const formInicial = {
  queixaPrincipal: "",
  achadoClinico: "",
  alergiasHistorico: "",
  procedimentoRealizado: "",
  observacoes: "",
  orientacoesPaciente: "",
};

export const useFichaConsulta = (id) => {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(1);
  
  const [agendamento, setAgendamento] = useState(null);
  const [paciente, setPaciente] = useState(null); // 🎯 Vai armazenar o paciente COMPLETO do banco agora
  const [prontuario, setProntuario] = useState(null);
  const [form, setForm] = useState(formInicial);

  const atualizarForm = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const carregarDados = useCallback(async () => {
    if (!id) return;
    try {
      setCarregando(true);
      setErro(null);

      // 1. Busca o agendamento
      const resAgendamento = await agendamentoService.buscarAgendamentoPorId(id);
      if (resAgendamento.error) {
        setErro(resAgendamento.message);
        return;
      }

      const dadosAgendamento = resAgendamento.data;
      setAgendamento(dadosAgendamento);

      const pacienteIdReal = dadosAgendamento?.pacienteId || dadosAgendamento?.paciente?.id;

      if (pacienteIdReal) {
     
        const resPacienteCompleto = await pacienteService.buscarPacientePorId(pacienteIdReal);
        if (!resPacienteCompleto.error && resPacienteCompleto.data) {
          setPaciente(resPacienteCompleto.data); 
        } else if (dadosAgendamento.paciente) {
          setPaciente(dadosAgendamento.paciente);
        }
      }

      // 3. Busca o prontuário
      const resProntuario = await prontuarioService.buscarProntuarioPorAgendamento(id);
      if (!resProntuario.error && resProntuario.data) {
        const pData = resProntuario.data;
        setProntuario(pData);
        setForm({
          queixaPrincipal: pData.queixaPrincipal || "",
          achadoClinico: pData.achadoClinico || "",
          alergiasHistorico: pData.alergiasHistorico || "",
          procedimentoRealizado: pData.procedimentoRealizado || "",
          observacoes: pData.observacoes || "",
          orientacoesPaciente: pData.orientacoesPaciente || "",
        });
      }

      // 4. Sincronização de Etapas baseada no statusConsulta
      const status = dadosAgendamento.statusConsulta?.toUpperCase();
      if (status === "AGENDADO") {
        setEtapaAtual(1);
      } else if (status === "PENDENTE") {
        setEtapaAtual(2); 
      } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(status)) {
        setEtapaAtual(4); 
      }

    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar os dados da consulta.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  const iniciarAtendimentoNoBackend = async () => {
    const payload = {
      id: Number(id),
      statusConsulta: "PENDENTE"
    };

    const resultado = await agendamentoService.atualizarAgendamento(payload);
    if (!resultado.error) {
      setAgendamento(resultado.data);
    }
    return resultado;
  };

  const consolidarConsulta = async () => {
    const payloadProntuario = {
      ...form,
      agendamentoId: Number(id),
    };

    const resProntuario = prontuario?.id
      ? await prontuarioService.atualizarProntuario({ id: prontuario.id, ...payloadProntuario })
      : await prontuarioService.criarProntuario(payloadProntuario);

    if (resProntuario.error) return resProntuario;

    const payloadStatus = {
      id: Number(id),
      statusConsulta: "CONCLUIDO"
    };

    const resStatus = await agendamentoService.atualizarAgendamento(payloadStatus);
    if (!resStatus.error) {
      setAgendamento(resStatus.data);
    }
    return resStatus;
  };

  return {
    carregando,
    erro,
    etapaAtual,
    setEtapaAtual,
    agendamento,
    paciente, 
    form,
    atualizarForm,
    carregarDados,
    iniciarAtendimentoNoBackend,
    consolidarConsulta,
  };
};