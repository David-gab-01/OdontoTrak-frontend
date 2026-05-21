import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

import { useFichaConsulta } from "../hooks/useFichaConsulta";
import { useOdontograma } from "../hooks/useOdontograma";

import Loading from "../components/Loading";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Odontograma from "../components/Odontograma";
import ProfileHeader from "../components/ProfileHeader";
import SectionCard from "../components/SectionCard";
import InfoCard from "../components/InfoCard";
import Input from "../components/Input";

const ETAPAS = [
  { id: 1, label: "Recepção" },
  { id: 2, label: "Avaliação" },
  { id: 3, label: "Procedimento" },
  { id: 4, label: "Conclusão" },
];

const FichaConsulta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const {
    carregando: consultaCarregando,
    erro: consultaErro,
    etapaAtual,
    setEtapaAtual,
    agendamento,
    paciente,
    form,
    atualizarForm,
    carregarDados,
    iniciarAtendimentoNoBackend,
    consolidarConsulta,
  } = useFichaConsulta(id);

  const {
    dentes,
    setDentes,
    carregarPorAgendamento,
    salvarOdontograma,
  } = useOdontograma();

  // Carrega todos os ecossistemas de dados assim que o ID da URL bater na tela
  useEffect(() => {
    carregarDados();
    carregarPorAgendamento(id);
  }, [id, carregarDados, carregarPorAgendamento]);

  // Validação para travar a tela em modo leitura se já concluído
  const statusAtual = agendamento?.statusConsulta?.toUpperCase();
  const consultaEncerrada = ["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(statusAtual);

  // Fallbacks de segurança para extração de dados do profissional e paciente
  const pacienteId = agendamento?.pacienteId || agendamento?.paciente?.id;
  const profissionalNome = agendamento?.profissional?.nome || agendamento?.nomeProfissional || "Não informado";
  const profissionalCRO = agendamento?.profissional?.registroProfissional || agendamento?.registroProfissional || "Não informado";

  // Formatadores de UI para datas e horários
  const formatarData = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "Não informado");
  const formatarHora = (iso) => (iso ? new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--");

  // Ações de fluxo e navegação
  const handleIniciarAtendimento = async () => {
    setModal({ type: "loading", message: "Iniciando atendimento..." });
    const resultado = await iniciarAtendimentoNoBackend(); // Envia "PENDENTE" pro Back

    if (resultado.error) {
      setModal({ type: "error", message: resultado.message || "Erro ao iniciar atendimento." });
      return;
    }
    setModal({ type: "success", message: "Atendimento iniciado com sucesso!" });
    setEtapaAtual(2);
  };

  const handleAvancarParaProcedimento = async () => {
    setModal({ type: "loading", message: "Salvando alterações do Odontograma..." });
    const resultado = await salvarOdontograma({ pacienteId, agendamentoId: Number(id) });

    if (resultado.error) {
      setModal({ type: "error", message: resultado.message || "Erro ao salvar odontograma." });
      return;
    }
    setModal(null);
    setEtapaAtual(3);
  };

  const handleEncerrarConsulta = async () => {
    if (!confirmado) return;
    setModal({ type: "loading", message: "Finalizando consulta e gerando prontuário..." });
    const resultado = await consolidarConsulta();

    if (resultado.error) {
      setModal({ type: "error", message: resultado.message || "Erro ao encerrar consulta." });
      return;
    }
    setModal({ type: "success", message: "Consulta encerrada com sucesso!" });
    setEtapaAtual(4);
  };

  if (consultaCarregando) return <Loading text="Carregando ficha de consulta..." />;

  if (consultaErro || !agendamento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-dentista-title">Consulta não encontrada</h2>
        <p className="text-dentista-body mt-2">{consultaErro || "Não foi possível carregar os dados."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      {/* Título e Identificação da Ficha */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dentista-title">Ficha de consulta</h1>
          <p className="text-sm text-dentista-body mt-1">Atendimento baseado no agendamento #{id}</p>
        </div>
      </div>

      {consultaEncerrada && (
        <div className="mb-6 rounded-clinica border border-green-200 bg-green-50 px-5 py-4 text-green-700 font-semibold flex items-center gap-2 animate-fade-in">
          <Check size={20} /> Histórico Clínico - Esta consulta já foi encerrada e consolidada.
        </div>
      )}

      {/* Bloco de Cards de Informações Básicas do Agendamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InfoCard title="Status do Agendamento" value={agendamento.statusConsulta || "Indefinido"} icon={ClipboardList} />
        <InfoCard title="Data da Consulta" value={formatarData(agendamento.dataInicio)} icon={Calendar} iconClassName="text-blue-500" iconBgClassName="bg-blue-50" />
        <InfoCard title="Horário Reservado" value={`${formatarHora(agendamento.dataInicio)} - ${formatarHora(agendamento.dataFim)}`} icon={Clock} iconClassName="text-orange-500" iconBgClassName="bg-orange-50" />
      </div>

      {/* Cabeçalho de Perfil com Informações Básicas do Paciente e Profissional */}
      <ProfileHeader
        title={paciente?.nome || agendamento?.paciente?.nome || "Paciente"}
        subtitle="Informações essenciais capturadas"
        avatarText={paciente?.nome?.charAt(0).toUpperCase() || "P"}
        fields={[
          { label: "Telefone", value: paciente?.telefone || "Não cadastrado" },
          { label: "E-mail", value: paciente?.email || "Não cadastrado" },
          { label: "Dentista Responsável", value: profissionalNome },
          { label: "CRO", value: profissionalCRO },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate(`/ficha-paciente/${pacienteId}`)}>
            Ver Histórico Completo
          </Button>
        }
      />

      {/* Stepper Superior */}
      <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {ETAPAS.map((etapa, index) => {
            const ativa = etapaAtual === etapa.id && !consultaEncerrada;
            const concluida = etapaAtual > etapa.id || consultaEncerrada;
            return (
              <React.Fragment key={etapa.id}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border transition ${concluida ? "bg-green-500 text-white border-green-500" : ativa ? "bg-dentista-primary text-white border-dentista-primary" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {concluida ? <Check size={22} /> : etapa.id}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${ativa ? "text-dentista-primary" : "text-dentista-title"}`}>{etapa.label}</p>
                    <p className="text-xs text-dentista-body">{ativa ? "Etapa atual" : concluida ? "Concluída" : "Pendente"}</p>
                  </div>
                </div>
                {index < ETAPAS.length - 1 && <div className="hidden md:block text-gray-300 font-bold">&gt;</div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DE CONTEÚDO */}
      {consultaEncerrada ? (
        /* VISUALIZAÇÃO APENAS-LEITURA (Prontuário e Odontograma Consolidados) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
          <SectionCard title="AVALIAÇÃO CLÍNICA">
            <div className="space-y-4 text-sm text-dentista-body">
              <div>
                <p className="font-bold text-dentista-title mb-1">Queixa principal</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.queixaPrincipal || "Não informado"}</p>
              </div>
              <div>
                <p className="font-bold text-dentista-title mb-1">Achado clínico</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.achadoClinico || "Não informado"}</p>
              </div>
              <div>
                <p className="font-bold text-dentista-title mb-1">Histórico & Alergias</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.alergiasHistorico || "Não informado"}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="ODONTOGRAMA CONSOLIDADO">
            <div className="pointer-events-none opacity-80">
              {/* Odontograma renderizado em modo estático apenas para visualização */}
              <Odontograma dentes={dentes} onChange={() => {}} disabled={true} />
            </div>
          </SectionCard>

          <SectionCard title="PROCEDIMENTO E ORIENTAÇÕES">
            <div className="space-y-4 text-sm text-dentista-body">
              <div>
                <p className="font-bold text-dentista-title mb-1">Procedimento Realizado</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.procedimentoRealizado || "Não informado"}</p>
              </div>
              <div>
                <p className="font-bold text-dentista-title mb-1">Observações adicionais</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.observacoes || "Não informado"}</p>
              </div>
              <div>
                <p className="font-bold text-dentista-title mb-1">Orientações passadas ao paciente</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">{form.orientacoesPaciente || "Não informado"}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : (
        /* FLUXO INTERATIVO POR ETAPAS (Consulta Ativa) */
        <>
          {etapaAtual === 1 && (
            <SectionCard title="Aguardando Início do Atendimento">
              <div className="text-center py-8">
                <Stethoscope size={44} className="mx-auto mb-4 text-dentista-primary animate-pulse" />
                <p className="text-dentista-body max-w-xl mx-auto mb-8">
                  Confirme a presença do paciente e as informações de agendamento exibidas acima. Ao clicar no botão abaixo, a consulta começará oficialmente no sistema.
                </p>
                <Button variant="primary" icon={ArrowRight} onClick={handleIniciarAtendimento}>
                  Iniciar Atendimento Clínico
                </Button>
              </div>
            </SectionCard>
          )}

          {etapaAtual === 2 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard title="Anamnese & Avaliação" subtitle="Preencha os dados obtidos na conversa inicial.">
                <div className="space-y-5">
                  <Input isTextArea label="Queixa principal" rows={4} value={form.queixaPrincipal} onChange={(e) => atualizarForm("queixaPrincipal", e.target.value)} placeholder="Ex: Paciente relata dor aguda no molar inferior ao ingerir líquidos gelados..." />
                  <Input isTextArea label="Achado clínico" rows={4} value={form.achadoClinico} onChange={(e) => atualizarForm("achadoClinico", e.target.value)} placeholder="Ex: Presença de infiltração na restauração de resina antiga..." />
                  <Input isTextArea label="Alergias / Histórico de saúde" rows={3} value={form.alergiasHistorico} onChange={(e) => atualizarForm("alergiasHistorico", e.target.value)} placeholder="Ex: Hipertenso controlado, alergia relatada a penicilina..." />
                </div>
              </SectionCard>
              
              <div className="space-y-4">
                <SectionCard title="Mapeamento Odontograma" subtitle="Selecione o dente para alterar o status em tempo real.">
                  <Odontograma dentes={dentes} onChange={setDentes} />
                </SectionCard>
              </div>
              
              <div className="xl:col-span-2 flex justify-end">
                <Button variant="primary" icon={ArrowRight} onClick={handleAvancarParaProcedimento}>
                  Salvar e Ir para Procedimentos
                </Button>
              </div>
            </div>
          )}

          {etapaAtual === 3 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard title="Resumo Clínico Coletado" subtitle="Consulta rápida da etapa anterior.">
                <div className="space-y-4 text-sm text-dentista-body">
                  <div><p className="font-semibold text-dentista-title">Queixa Principal</p><p className="bg-gray-50 p-2 rounded-lg mt-1">{form.queixaPrincipal || "Nenhuma queixa registrada."}</p></div>
                  <div><p className="font-semibold text-dentista-title">Achados Clínicos</p><p className="bg-gray-50 p-2 rounded-lg mt-1">{form.achadoClinico || "Nenhum achado registrado."}</p></div>
                </div>
              </SectionCard>

              {/* Input Fantasma removido com sucesso. Mantido apenas o escopo de Procedimentos e Observações */}
              <SectionCard title="Procedimento Realizado" subtitle="Detalhamento técnico da intervenção de hoje.">
                <div className="space-y-5">
                  <Input isTextArea label="Descrição técnica do procedimento" rows={5} value={form.procedimentoRealizado} onChange={(e) => atualizarForm("procedimentoRealizado", e.target.value)} placeholder="Ex: Realizado isolamento absoluto, remoção de tecido cariado e nova restauração em resina composta no dente 46..." />
                  <Input isTextArea label="Observações adicionais" rows={3} value={form.observacoes} onChange={(e) => atualizarForm("observacoes", e.target.value)} placeholder="Ex: Recomendações de retorno em 6 meses passadas..." />
                </div>
              </SectionCard>

              <div className="xl:col-span-2 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEtapaAtual(2)}>Voltar para Avaliação</Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setEtapaAtual(4)}>Ir para Conclusão</Button>
              </div>
            </div>
          )}

          {etapaAtual === 4 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard title="Revisão Final da Consulta" subtitle="Confira o prontuário completo antes de consolidar.">
                <div className="space-y-4 text-sm text-dentista-body">
                  <div><p className="font-bold text-dentista-title">Queixa Principal:</p><p className="text-gray-600">{form.queixaPrincipal || "Não informada"}</p></div>
                  <div><p className="font-bold text-dentista-title">Achados Clínicos:</p><p className="text-gray-600">{form.achadoClinico || "Não informado"}</p></div>
                  <div><p className="font-bold text-dentista-title">Procedimento Executado:</p><p className="text-gray-600">{form.procedimentoRealizado || "Não informado"}</p></div>
                </div>
              </SectionCard>

              <SectionCard title="Orientações & Encerramento" subtitle="Finalização do atendimento e orientações ao paciente.">
                <div className="space-y-5">
                  <Input isTextArea label="Orientações pós-consulta" rows={5} value={form.orientacoesPaciente} onChange={(e) => atualizarForm("orientacoesPaciente", e.target.value)} placeholder="Ex: Evitar mastigação de alimentos excessivamente rígidos nas próximas duas horas..." />
                  
                  <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-dentista-body cursor-pointer hover:bg-gray-50 transition">
                    <input type="checkbox" checked={confirmado} onChange={(e) => setConfirmado(e.target.checked)} className="mt-1 accent-dentista-primary" />
                    <span>Confirmo que revisei o prontuário de atendimento acima e autorizo a consolidação definitiva desta consulta.</span>
                  </label>
                </div>
              </SectionCard>

              <div className="xl:col-span-2 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEtapaAtual(3)}>Voltar para Procedimento</Button>
                <Button variant="primary" disabled={!confirmado} onClick={handleEncerrarConsulta} className={!confirmado ? "opacity-50 cursor-not-allowed" : ""}>
                  Concluir e Encerrar Atendimento
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Componente Global de Modais de Feedback e Loading */}
      {modal && <Modal type={modal.type} message={modal.message} onClose={() => setModal(null)} />}
    </div>
  );
};

export default FichaConsulta;