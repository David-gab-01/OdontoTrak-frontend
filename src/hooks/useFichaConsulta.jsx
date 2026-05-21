import { useState, useCallback } from "react";
// Importando os services com o padrão nomeado correto
import * as agendamentoService from "../services/agendamentoService"; 
import * as prontuarioService from "../services/prontuarioService";   

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
  const [paciente, setPaciente] = useState(null);
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

      // 1. Nome exato do seu service: buscarAgendamentoPorId
      const resAgendamento = await agendamentoService.buscarAgendamentoPorId(id);
      if (resAgendamento.error) {
        setErro(resAgendamento.message);
        return;
      }

      const dadosAgendamento = resAgendamento.data;
      setAgendamento(dadosAgendamento);

      // 2. Aproveitando os dados do paciente que sua API já traz anexado
      if (dadosAgendamento.paciente) {
        setPaciente(dadosAgendamento.paciente);
      }

      // 3. CORRIGIDO: Nome exato da sua função: buscarProntuarioPorAgendamento
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

      // 4. Sincronização de Etapas baseada no statusConsulta real do banco
      const status = dadosAgendamento.statusConsulta?.toUpperCase();
      
      if (status === "AGENDADO") {
        setEtapaAtual(1);
      } else if (status === "PENDENTE") {
        setEtapaAtual(2); // Se já está PENDENTE, joga direto na tela de avaliação/anamnese
      } else if (["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(status)) {
        setEtapaAtual(4); // Se já encerrou, joga para o modo leitura estática
      }

    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar os dados da consulta.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  const iniciarAtendimentoNoBackend = async () => {
    // Particularidade: Enviando o ID e o status "PENDENTE" para contornar o bug do ENUM no backend
    // Usando seu método genérico: atualizarAgendamento
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

    // CORRIGIDO: Usando atualizarProntuario e criarProntuario conforme seu arquivo prontuarioService.js
    const resProntuario = prontuario?.id
      ? await prontuarioService.atualizarProntuario({ id: prontuario.id, ...payloadProntuario })
      : await prontuarioService.criarProntuario(payloadProntuario);

    if (resProntuario.error) return resProntuario;

    // Atualiza o status do agendamento para CONCLUIDO usando seu service generic
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