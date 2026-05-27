import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Contact, Save } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";

import { usePacientes } from "../hooks/usePacientes";

import {
  formatarCPF,
  formatarTelefone,
} from "../utils/formatadores";

import {
  apenasNumeros,
  validarEmail,
  validarTelefone,
} from "../utils/validadores";

const NovoPaciente = () => {
  const navigate = useNavigate();
  const { salvarPaciente, carregando } = usePacientes();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const [erros, setErros] = useState({});

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const fecharModal = () => {
    setModal({
      open: false,
      type: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === "cpf") {
      novoValor = formatarCPF(value);
    }

    if (name === "telefone") {
      novoValor = formatarTelefone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: novoValor,
    }));

    if (erros[name]) {
      setErros((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "Nome obrigatório";
    }

    if (!formData.cpf || apenasNumeros(formData.cpf).length !== 11) {
      novosErros.cpf = "CPF incompleto ou obrigatório";
    }

    if (!formData.dataNascimento) {
      novosErros.dataNascimento = "Data obrigatória";
    }

    if (!validarTelefone(formData.telefone)) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!validarEmail(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    if (!formData.endereco.trim()) {
      novosErros.endereco = "Endereço obrigatório";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSave = async (e) => {
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
      message: "Salvando paciente...",
    });

    const dadosParaEnviar = {
      ...formData,
      cpf: apenasNumeros(formData.cpf),
      telefone: apenasNumeros(formData.telefone),
    };

    const resultado = await salvarPaciente(dadosParaEnviar);

    if (!resultado.error) {
      setModal({
        open: true,
        type: "success",
        message: "Paciente cadastrado com sucesso!",
      });

      setTimeout(() => {
        navigate("/pacientes");
      }, 1500);

      return;
    }

    setModal({
      open: true,
      type: "error",
      message: resultado.message || "Erro ao cadastrar paciente.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <BackButton label="Voltar" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">
          Cadastrar Novo Paciente
        </h1>

        <p className="text-dentista-body opacity-70">
          Preencha os campos obrigatórios para o registro no sistema.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <User size={20} />
            <h2 className="font-bold text-lg text-dentista-title">
              Identificação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo *"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome do paciente"
              className="md:col-span-2"
              error={erros.nome}
            />

            <Input
              label="CPF *"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength={14}
              error={erros.cpf}
            />

            <Input
              label="Data de Nascimento *"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              type="date"
              error={erros.dataNascimento}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <Contact size={20} />
            <h2 className="font-bold text-lg text-dentista-title">
              Contato e Endereço
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Telefone *"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
              error={erros.telefone}
            />

            <Input
              label="E-mail *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="paciente@email.com"
              error={erros.email}
            />

            <Input
              label="Endereço Completo *"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro e cidade"
              className="md:col-span-2"
              isTextArea
              rows={2}
              error={erros.endereco}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Save}
            loading={carregando}
          >
            Salvar Paciente
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

export default NovoPaciente;