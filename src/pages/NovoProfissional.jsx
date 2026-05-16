import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";
import { useProfissionais } from "../hooks/useProfissionais";

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
    perfis: ["ROLE_DENTISTA"]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Nome, E-mail e Senha são obrigatórios.");
      return;
    }

    // Se não for denstista, envia uma string "N/A para o campo registroProfissional"
    const dadosParaEnviar = { ...formData };
    if (formData.perfis[0] !== "ROLE_DENTISTA") {
      dadosParaEnviar.registroProfissional = "N/A";
    }

    const resultado = await salvarProfissional(dadosParaEnviar);

    if (!resultado.error) {
      alert("Profissional cadastrado com sucesso!");
      navigate("/profissionais");
    } else {
      alert(resultado.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isDentista = formData.perfis[0] === "ROLE_DENTISTA";

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <BackButton />

      <h1 className="text-3xl font-bold text-dentista-title mb-8">Cadastrar Novo Profissional</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Perfil de Acesso movido para o topo */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-dentista-title opacity-70">Perfil de Acesso *</label>
            <select 
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-dentista-primary text-sm bg-gray-50 font-medium"
              value={formData.perfis[0]}
              onChange={(e) => handleChange("perfis", [e.target.value])}
            >
              <option value="ROLE_DENTISTA">Dentista</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_RECEPCIONISTA">Recepção</option>
            </select>
          </div>

          <Input 
            label="Nome Completo *" 
            placeholder="Ex: Dr. João Silva"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="md:col-span-2"
            required
          />
          
          <Input 
            label="E-mail *" 
            type="email"
            placeholder="email@clinica.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <Input 
            label="Senha de Acesso *" 
            type="password"
            placeholder="******"
            value={formData.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
            required
          />

          <Input 
            label="CPF" 
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />

          <Input 
            label="Telefone" 
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
          />

          {/* 2. Condição para mostrar o Registro Profissional */}
          {isDentista && (
            <Input 
              label="Registro Profissional (CRO) *" 
              placeholder="Ex: CRO-SP 12345"
              value={formData.registroProfissional}
              onChange={(e) => handleChange("registroProfissional", e.target.value)}
              required={isDentista}
              className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="primary" type="submit" icon={Save} loading={carregando}>
            Salvar Profissional
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoProfissional;