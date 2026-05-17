import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";
import Modal from "../components/Modal";

import { useProfissionais } from "../hooks/useProfissionais";

import {
  formatarCPF,
  formatarTelefone,
} from "../utils/formatadores";

import {
  apenasNumeros,
  validarCPF,
  validarEmail,
  validarTelefone,
  validarSenha,
  validarCRO,
} from "../utils/validadores";

const NovoProfissional = () => {
  const navigate = useNavigate();
  const { salvarProfissional, carregando } = useProfissionais();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    registroProfissional: "",
    perfis: ["ROLE_DENTISTA"],
  });

  const [erros, setErros] = useState({});

  const [modal, setModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const isDentista = formData.perfis[0] === "ROLE_DENTISTA";

  const fecharModal = () => {
    setModal({
      open: false,
      type: "",
      message: "",
    });
  };

  const handleChange = (field, value) => {
    let novoValor = value;

    if (field === "cpf") {
      novoValor = formatarCPF(value);
    }

    if (field === "telefone") {
      novoValor = formatarTelefone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: novoValor,
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

    if (!formData.nome.trim()) {
      novosErros.nome = "Nome obrigatório";
    }

    if (!validarEmail(formData.email)) {
      novosErros.email = "E-mail inválido";
    }

    if (!validarSenha(formData.senha)) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres";
    }

    if (formData.cpf && !validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    if (formData.telefone && !validarTelefone(formData.telefone)) {
      novosErros.telefone = "Telefone inválido";
    }

    if (isDentista && !validarCRO(formData.registroProfissional)) {
      novosErros.registroProfissional = "CRO obrigatório";
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
      message: "Salvando profissional...",
    });

    const dadosParaEnviar = {
      ...formData,
      cpf: apenasNumeros(formData.cpf),
      telefone: apenasNumeros(formData.telefone),
    };

    if (!isDentista) {
      dadosParaEnviar.registroProfissional = "N/A";
    }

    const resultado = await salvarProfissional(dadosParaEnviar);

    if (!resultado.error) {
      setModal({
        open: true,
        type: "success",
        message: "Profissional cadastrado com sucesso!",
      });

      setTimeout(() => {
        navigate("/profissionais");
      }, 1500);

      return;
    }

    setModal({
      open: true,
      type: "error",
      message: resultado.message || "Erro ao cadastrar profissional.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <BackButton />

      <h1 className="text-3xl font-bold text-dentista-title mb-8">
        Cadastrar Novo Profissional
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Perfil de Acesso *"
            isSelect
            value={formData.perfis[0]}
            onChange={(e) => handleChange("perfis", [e.target.value])}
            className="md:col-span-2"
          >
            <option value="ROLE_DENTISTA">Dentista</option>
            <option value="ROLE_ADMIN">Administrador</option>
            <option value="ROLE_RECEPCIONISTA">Recepção</option>
          </Input>

          <Input
            label="Nome Completo *"
            placeholder="Ex: Dr. João Silva"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="md:col-span-2"
            error={erros.nome}
          />

          <Input
            label="E-mail *"
            type="email"
            placeholder="email@clinica.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={erros.email}
          />

          <Input
            label="Senha de Acesso *"
            type="password"
            placeholder="******"
            value={formData.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
            error={erros.senha}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
            maxLength={14}
            error={erros.cpf}
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
            maxLength={15}
            error={erros.telefone}
          />

          {isDentista && (
            <Input
              label="Registro Profissional (CRO) *"
              placeholder="Ex: CRO-SP 12345"
              value={formData.registroProfissional}
              onChange={(e) =>
                handleChange("registroProfissional", e.target.value)
              }
              error={erros.registroProfissional}
              className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            icon={Save}
            loading={carregando}
          >
            Salvar Profissional
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

export default NovoProfissional;