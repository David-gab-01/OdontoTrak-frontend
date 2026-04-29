import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Contact, Save } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { usePacientes } from "../hooks/usePacientes";

const NovoPaciente = () => {
  const navigate = useNavigate();
  const { salvarPaciente, carregando } = usePacientes();

  // Estado inicial do formulário baseado nas rotas do Postman
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    endereco: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.cpf) {
      alert("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    const resultado = await salvarPaciente(formData);

    if (!resultado.error) {
      alert("Paciente cadastrado com sucesso!");
      navigate("/pacientes"); // Volta para a listagem
    } else {
      alert(resultado.message); // Exibe o erro vindo do Java
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <BackButton label="Voltar"/>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">Cadastrar Novo Paciente</h1>
        <p className="text-dentista-body opacity-70">Preencha os campos obrigatórios para o registro no sistema.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloco de Identificação */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <User size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Identificação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nome Completo *" 
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome do paciente" 
              className="md:col-span-2"
              required
            />
            <Input 
              label="CPF (Somente números) *" 
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="00000000000" 
              required
            />
            <Input 
              label="Data de Nascimento *" 
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              type="date" 
              required
            />
          </div>
        </div>

        {/* Bloco de Contato e Localização */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <Contact size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Contato e Endereço</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Telefone *" 
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="999999999" 
              required
            />
            <Input 
              label="E-mail *" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              placeholder="paciente@email.com" 
              required
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
              required
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
    </div>
  );
};

export default NovoPaciente;