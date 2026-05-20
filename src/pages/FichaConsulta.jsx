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

import Loading from "../components/Loading";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Odontograma from "../components/Odontograma";
import ProfileHeader from "../components/ProfileHeader";
import SectionCard from "../components/SectionCard";
import InfoCard from "../components/InfoCard";

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
    carregando,
    erro,
    etapaAtual,
    setEtapaAtual,
    agendamento,
    paciente,
    dentes,
    setDentes,
    form,
    atualizarForm,
    carregarDados,
    iniciarAtendimento,
    salvarAvaliacao,
    encerrarConsulta,
  } = useFichaConsulta(id);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const consultaEncerrada =
    ["CONCLUIDO", "FINALIZADO", "CONCLUIDA"].includes(
      agendamento?.statusConsulta
    );

  const pacienteId = agendamento?.pacienteId || agendamento?.paciente?.id;

  const profissionalNome =
    agendamento?.profissional?.nome ||
    agendamento?.nomeProfissional ||
    `Profissional ${agendamento?.profissionalId || ""}`;

  const profissionalCRO =
    agendamento?.profissional?.registroProfissional ||
    agendamento?.registroProfissional ||
    "";

  const formatarData = (iso) => {
    if (!iso) return "Não informado";
    return new Date(iso).toLocaleDateString("pt-BR");
  };

  const formatarHora = (iso) => {
    if (!iso) return "--:--";

    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleIniciarAtendimento = async () => {
    setModal({
      type: "loading",
      message: "Iniciando atendimento...",
    });

    const resultado = await iniciarAtendimento();

    if (resultado.error) {
      setModal({
        type: "error",
        message: resultado.message || "Erro ao iniciar atendimento.",
      });
      return;
    }

    setModal({
      type: "success",
      message: "Atendimento iniciado com sucesso!",
    });
  };

  const handleSalvarAvaliacao = async () => {
    setModal({
      type: "loading",
      message: "Salvando avaliação...",
    });

    const resultado = await salvarAvaliacao();

    if (resultado.error) {
      setModal({
        type: "error",
        message: resultado.message || "Erro ao salvar avaliação.",
      });
      return;
    }

    setModal({
      type: "success",
      message: "Avaliação salva com sucesso!",
    });
  };

  const handleEncerrarConsulta = async () => {
    if (!confirmado) return;

    setModal({
      type: "loading",
      message: "Encerrando consulta...",
    });

    const resultado = await encerrarConsulta();

    if (resultado.error) {
      setModal({
        type: "error",
        message: resultado.message || "Erro ao encerrar consulta.",
      });
      return;
    }

    setModal({
      type: "success",
      message: "Consulta encerrada com sucesso!",
    });
  };

  const CampoTexto = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    disabled = false,
  }) => (
    <div>
      <label className="block text-sm font-semibold text-dentista-title mb-2">
        {label}
      </label>

      <textarea
        rows={rows}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-dentista-body outline-none transition focus:border-dentista-primary focus:ring-2 focus:ring-dentista-primary/10 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );

  const Stepper = () => (
    <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {ETAPAS.map((etapa, index) => {
          const ativa = etapaAtual === etapa.id && !consultaEncerrada;
          const concluida = etapaAtual > etapa.id || consultaEncerrada;

          return (
            <React.Fragment key={etapa.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border transition ${
                    concluida
                      ? "bg-green-500 text-white border-green-500"
                      : ativa
                      ? "bg-dentista-primary text-white border-dentista-primary"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {concluida ? <Check size={22} /> : etapa.id}
                </div>

                <div>
                  <p
                    className={`text-sm font-bold ${
                      ativa ? "text-dentista-primary" : "text-dentista-title"
                    }`}
                  >
                    {etapa.label}
                  </p>

                  <p className="text-xs text-dentista-body">
                    {ativa
                      ? "Etapa atual"
                      : concluida
                      ? "Concluída"
                      : "Pendente"}
                  </p>
                </div>
              </div>

              {index < ETAPAS.length - 1 && (
                <div className="hidden md:block text-gray-300 font-bold">
                  &gt;
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  if (carregando) {
    return <Loading text="Carregando ficha de consulta..." />;
  }

  if (erro || !agendamento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <AlertCircle size={48} className="text-red-500 mb-4" />

        <h2 className="text-xl font-bold text-dentista-title">
          Consulta não encontrada
        </h2>

        <p className="text-dentista-body mt-2">
          {erro || "Não foi possível carregar os dados da consulta."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dentista-title">
            Ficha de consulta
          </h1>

          <p className="text-sm text-dentista-body mt-1">
            Atendimento odontológico baseado no agendamento #{id}
          </p>
        </div>
      </div>

      {consultaEncerrada && (
        <div className="mb-6 rounded-clinica border border-green-200 bg-green-50 px-5 py-4 text-green-700 font-semibold flex items-center gap-2">
          <Check size={20} />
          Consulta encerrada
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InfoCard
          title="Status"
          value={agendamento.statusConsulta || "Indefinido"}
          icon={ClipboardList}
        />

        <InfoCard
          title="Data"
          value={formatarData(agendamento.dataInicio)}
          icon={Calendar}
          iconClassName="text-blue-500"
          iconBgClassName="bg-blue-50"
        />

        <InfoCard
          title="Horário"
          value={`${formatarHora(agendamento.dataInicio)} - ${formatarHora(
            agendamento.dataFim
          )}`}
          icon={Clock}
          iconClassName="text-orange-500"
          iconBgClassName="bg-orange-50"
        />
      </div>

      <ProfileHeader
        title={paciente?.nome || agendamento?.paciente?.nome || "Paciente"}
        subtitle="Informações do paciente"
        avatarText={
          paciente?.nome?.charAt(0).toUpperCase() ||
          agendamento?.paciente?.nome?.charAt(0).toUpperCase() ||
          "P"
        }
        fields={[
          {
            label: "Telefone",
            value: paciente?.telefone || "Não informado",
          },
          {
            label: "E-mail",
            value: paciente?.email || "Não informado",
          },
          {
            label: "Profissional",
            value: profissionalNome,
          },
          {
            label: "CRO",
            value: profissionalCRO || "Não informado",
          },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/ficha-paciente/${pacienteId}`)}
          >
            Ver Ficha
          </Button>
        }
      />

      <Stepper />

      {consultaEncerrada ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard title="AVALIAÇÃO">
            <div className="space-y-4 text-sm text-dentista-body">
              <div>
                <p className="font-semibold text-dentista-title">
                  Queixa principal
                </p>
                <p>{form.queixaPrincipal || "Não informado"}</p>
              </div>

              <div>
                <p className="font-semibold text-dentista-title">
                  Achado clínico
                </p>
                <p>{form.achadoClinico || "Não informado"}</p>
              </div>

              <div>
                <p className="font-semibold text-dentista-title mb-2">
                  Odontograma
                </p>
                <Odontograma dentes={dentes} onChange={() => {}} disabled />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="PROCEDIMENTO">
            <div className="space-y-4 text-sm text-dentista-body">
              <div>
                <p className="font-semibold text-dentista-title">
                  Procedimento realizado
                </p>
                <p>{form.procedimentoRealizado || "Não informado"}</p>
              </div>

              <div>
                <p className="font-semibold text-dentista-title">
                  Materiais utilizados
                </p>
                <p>{form.material || "Não informado"}</p>
              </div>

              <div>
                <p className="font-semibold text-dentista-title">Observações</p>
                <p>{form.observacoes || "Não informado"}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="CONCLUSÃO">
            <div className="space-y-4 text-sm text-dentista-body">
              <div>
                <p className="font-semibold text-dentista-title">
                  Orientações ao paciente
                </p>
                <p>{form.orientacoesPaciente || "Não informado"}</p>
              </div>

              <div>
                <p className="font-semibold text-dentista-title">Responsável</p>
                <p>{profissionalNome}</p>
                <p>{profissionalCRO || "CRO não informado"}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      ) : (
        <>
          {etapaAtual === 1 && (
            <SectionCard title="Recepção">
              <div className="text-center py-8">
                <Stethoscope
                  size={44}
                  className="mx-auto mb-4 text-dentista-primary"
                />

                <p className="text-dentista-body max-w-2xl mx-auto mb-8">
                  Revise as informações da consulta e do paciente antes de
                  iniciar o atendimento. Após confirmar, o status da consulta
                  será atualizado automaticamente.
                </p>

                <Button
                  variant="primary"
                  icon={ArrowRight}
                  onClick={handleIniciarAtendimento}
                >
                  Iniciar atendimento
                </Button>
              </div>
            </SectionCard>
          )}

          {etapaAtual === 2 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard
                title="Anamnese"
                subtitle="Preencha a avaliação clínica inicial."
              >
                <div className="space-y-5">
                  <CampoTexto
                    label="Queixa principal"
                    rows={5}
                    value={form.queixaPrincipal}
                    onChange={(value) =>
                      atualizarForm("queixaPrincipal", value)
                    }
                    placeholder="Ex: Paciente relata dor espontânea..."
                  />

                  <CampoTexto
                    label="Achado clínico"
                    rows={4}
                    value={form.achadoClinico}
                    onChange={(value) => atualizarForm("achadoClinico", value)}
                    placeholder="Ex: Lesão cariosa extensa..."
                  />

                  <CampoTexto
                    label="Alergias / Histórico"
                    rows={3}
                    value={form.alergiasHistorico}
                    onChange={(value) =>
                      atualizarForm("alergiasHistorico", value)
                    }
                    placeholder="Ex: Alergia a dipirona..."
                  />
                </div>
              </SectionCard>

              <div className="space-y-4">
                <Odontograma dentes={dentes} onChange={setDentes} />
              </div>

              <div className="xl:col-span-2 flex justify-end">
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  onClick={handleSalvarAvaliacao}
                >
                  Realizar procedimento
                </Button>
              </div>
            </div>
          )}

          {etapaAtual === 3 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard
                title="Resumo da avaliação"
                subtitle="Dados vindos da etapa anterior."
              >
                <div className="space-y-4 text-sm text-dentista-body">
                  <div>
                    <p className="font-semibold text-dentista-title">
                      Queixa principal
                    </p>
                    <p>{form.queixaPrincipal || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-dentista-title">
                      Achado clínico
                    </p>
                    <p>{form.achadoClinico || "Não informado"}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Procedimentos"
                subtitle="Registre o procedimento realizado."
              >
                <div className="space-y-5">
                  <CampoTexto
                    label="Descrição do procedimento"
                    rows={5}
                    value={form.procedimentoRealizado}
                    onChange={(value) =>
                      atualizarForm("procedimentoRealizado", value)
                    }
                    placeholder="Ex: Realizada restauração classe II..."
                  />

                  <CampoTexto
                    label="Materiais utilizados"
                    rows={4}
                    value={form.material}
                    onChange={(value) => atualizarForm("material", value)}
                    placeholder="Ex: Resina composta A2..."
                  />

                  <CampoTexto
                    label="Observações"
                    rows={3}
                    value={form.observacoes}
                    onChange={(value) => atualizarForm("observacoes", value)}
                    placeholder="Ex: Paciente relatou leve sensibilidade..."
                  />
                </div>
              </SectionCard>

              <div className="xl:col-span-2 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEtapaAtual(2)}>
                  Voltar
                </Button>

                <Button
                  variant="primary"
                  icon={ArrowRight}
                  onClick={() => setEtapaAtual(4)}
                >
                  Concluir consulta
                </Button>
              </div>
            </div>
          )}

          {etapaAtual === 4 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SectionCard
                title="Resumo da consulta"
                subtitle="Revise as informações antes de encerrar."
              >
                <div className="space-y-4 text-sm text-dentista-body">
                  <div>
                    <p className="font-semibold text-dentista-title">
                      Queixa principal
                    </p>
                    <p>{form.queixaPrincipal || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-dentista-title">
                      Achado clínico
                    </p>
                    <p>{form.achadoClinico || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-dentista-title">
                      Procedimento realizado
                    </p>
                    <p>{form.procedimentoRealizado || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-dentista-title">
                      Materiais utilizados
                    </p>
                    <p>{form.material || "Não informado"}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Conclusão"
                subtitle="Informe as orientações e confirme o encerramento."
              >
                <div className="space-y-5">
                  <CampoTexto
                    label="Orientações ao paciente"
                    rows={6}
                    value={form.orientacoesPaciente}
                    onChange={(value) =>
                      atualizarForm("orientacoesPaciente", value)
                    }
                    placeholder="Ex: Evitar alimentos gelados por 24h..."
                  />

                  <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm text-dentista-body">
                    <input
                      type="checkbox"
                      checked={confirmado}
                      onChange={(e) => setConfirmado(e.target.checked)}
                      className="mt-1"
                    />

                    <span>
                      Confirmo que as informações registradas estão corretas e
                      autorizo o encerramento desta consulta.
                    </span>
                  </label>
                </div>
              </SectionCard>

              <div className="xl:col-span-2 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEtapaAtual(3)}>
                  Voltar
                </Button>

                <Button
                  variant="primary"
                  disabled={!confirmado}
                  onClick={handleEncerrarConsulta}
                  className={!confirmado ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Encerrar consulta
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default FichaConsulta;