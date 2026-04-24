import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import BackButton from "../components/BackButton";

const NovoProfissional = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    registroProfissional: "",
    perfis: ["ROLE_DENTISTA"]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando para API:", formData);
    // Aqui viria o seu axios.post(...)
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
     <BackButton />

      <h1 className="text-3xl font-bold text-dentista-title mb-8">Cadastrar Novo Profissional</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Nome Completo" 
            placeholder="Ex: Dr. João Silva"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="md:col-span-2"
          />
          
          <Input 
            label="E-mail" 
            type="email"
            placeholder="email@clinica.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <Input 
            label="Senha de Acesso" 
            type="password"
            placeholder="******"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
          />

          <Input 
            label="CPF" 
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
          />

          <Input 
            label="Telefone" 
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
          />

          <Input 
            label="Registro Profissional (CRO)" 
            placeholder="Ex: CRO123"
            value={formData.registroProfissional}
            onChange={(e) => setFormData({...formData, registroProfissional: e.target.value})}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-dentista-title opacity-70">Perfil de Acesso</label>
            <select 
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-dentista-primary text-sm bg-white"
              value={formData.perfis[0]}
              onChange={(e) => setFormData({...formData, perfis: [e.target.value]})}
            >
              <option value="ROLE_DENTISTA">Dentista</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_RECEPCAO">Recepção</option>
            </select>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="primary" type="submit" icon={Save}>Salvar Profissional</Button>
        </div>
      </form>
    </div>
  );
};

export default NovoProfissional;