import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Clock, CheckCircle, Save } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";

import { usePacientes } from "../hooks/usePacientes";
import { useProfissionais } from "../hooks/useProfissionais";
import { useAgendamentos } from "../hooks/useAgendamentos";

const NovaConsulta = () => {
  const navigate = useNavigate();

  const { pacientes, carregarPacientes } = usePacientes();
  const { profissionais, carregarProfissionais } = useProfissionais();
  const { salvarAgendamento, carregando } = useAgendamentos();

  const [formData, setFormData] = useState({
    pacienteId: "",
    profissionalId: "",
    dataInicio: "",
    dataFim: "",
    statusConsulta: "AGENDADO",
  });

  const [erros, setErros] = useState({});

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    carregarPacientes();
    carregarProfissionais();
  }, [carregarPacientes, carregarProfissionais]);

  const fecharModal = () => {
    setModal({
      open: false,
      type: "",
      message: "",
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (erros[field]) {
      setErros((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.pacienteId) {
      novosErros.pacienteId = "Selecione um paciente";
    }

    if (!formData.profissionalId) {
      novosErros.profissionalId = "Selecione um profissional";
    }

    if (!formData.dataInicio) {
      novosErros.dataInicio = "Data inicial obrigatória";
    }

    if (!formData.dataFim) {
      novosErros.dataFim = "Data final obrigatória";
    }

    if (
      formData.dataInicio &&
      formData.dataFim &&
      new Date(formData.dataFim) <= new Date(formData.dataInicio)
    ) {
      novosErros.dataFim =
        "A data final deve ser maior que a inicial";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setModal({
        open: true,
        type: "error",
        message: "Preencha os campos corretamente.",
      });

      return;
    }

    setModal({
      open: true,
      type: "loading",
      message: "Agendando consulta...",
    });

    const res = await salvarAgendamento(formData);

    if (!res.error) {
      setModal({
        open: true,
        type: "success",
        message: "Consulta agendada com sucesso!",
      });

      setTimeout(() => {
        navigate("/consultas");
      }, 1500);

      return;
    }

    setModal({
      open: true,
      type: "error",
      message: res.message || "Erro ao agendar consulta.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <BackButton label="Voltar" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">
          Agendar Nova Consulta
        </h1>

        <p className="text-dentista-body opacity-70">
          Defina os participantes e o cronograma do atendimento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <User size={20} />
            <h2 className="font-bold text-lg text-dentista-title">
              Participantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              isSelect
              label="Paciente *"
              value={formData.pacienteId}
              onChange={(e) =>
                handleChange("pacienteId", e.target.value)
              }
              error={erros.pacienteId}
            >
              <option value="">Selecione o paciente...</option>

              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Input>

            <Input
              isSelect
              label="Profissional *"
              value={formData.profissionalId}
              onChange={(e) =>
                handleChange("profissionalId", e.target.value)
              }
              error={erros.profissionalId}
            >
              <option value="">Selecione o dentista...</option>

              {profissionais.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome} - {d.registroProfissional}
                </option>
              ))}
            </Input>
          </div>
        </div>

        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <Clock size={20} />
            <h2 className="font-bold text-lg text-dentista-title">
              Data e Horário
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Início da Consulta *"
              type="datetime-local"
              value={formData.dataInicio}
              onChange={(e) =>
                handleChange("dataInicio", e.target.value)
              }
              error={erros.dataInicio}
            />

            <Input
              label="Fim da Consulta *"
              type="datetime-local"
              value={formData.dataFim}
              onChange={(e) =>
                handleChange("dataFim", e.target.value)
              }
              error={erros.dataFim}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <CheckCircle size={20} />
            <h2 className="font-bold text-lg text-dentista-title">
              Status
            </h2>
          </div>

          <div className="max-w-xs">
            <Input
              isSelect
              label="Status da Consulta"
              disabled
              value={formData.statusConsulta}
            >
              <option value="AGENDADO">AGENDADO</option>
            </Input>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            icon={Save}
            loading={carregando}
          >
            Confirmar Agendamento
          </Button>
        </div>
      </form>

      {modal.open && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={fecharModal}
        />
      )}
    </div>
  );
};

export default NovaConsulta;