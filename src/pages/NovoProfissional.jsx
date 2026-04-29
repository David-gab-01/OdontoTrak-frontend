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

    const resultado = await salvarProfissional(formData);

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

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <BackButton />

      <h1 className="text-3xl font-bold text-dentista-title mb-8">Cadastrar Novo Profissional</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            placeholder="00000000000"
            value={formData.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />

          <Input 
            label="Telefone" 
            placeholder="99999999999"
            value={formData.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
          />

          <Input 
            label="Registro Profissional (CRO)" 
            placeholder="Ex: CRO123"
            value={formData.registroProfissional}
            onChange={(e) => handleChange("registroProfissional", e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-dentista-title opacity-70">Perfil de Acesso</label>
            <select 
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-dentista-primary text-sm bg-white"
              value={formData.perfis[0]}
              onChange={(e) => handleChange("perfis", [e.target.value])}
            >
              <option value="ROLE_DENTISTA">Dentista</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_RECEPCAO">Recepção</option>
            </select>
          </div>
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