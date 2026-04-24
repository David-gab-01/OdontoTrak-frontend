import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Contact, MapPin, ArrowLeft, Save } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import BackButton from "../components/BackButton";

const NovoPaciente = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto pb-10">

       <BackButton label="Voltar"/>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dentista-title">Cadastrar Novo Paciente</h1>
        <p className="text-dentista-body opacity-70">Preencha os campos obrigatórios para o registro no sistema.</p>
      </div>

      <div className="space-y-6">
        {/* Bloco de Identificação */}
        <div className="bg-white p-8 rounded-clinica shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-dentista-primary mb-6 border-b pb-4">
            <User size={20} />
            <h2 className="font-bold text-lg text-dentista-title">Identificação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nome Completo *" 
              placeholder="Digite o nome do paciente" 
              className="md:col-span-2"
            />
            <Input 
              label="CPF (Somente números) *" 
              placeholder="00000000000" 
            />
            <Input 
              label="Data de Nascimento *" 
              type="date" 
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
              placeholder="999999999" 
            />
            <Input 
              label="E-mail *" 
              type="email" 
              placeholder="paciente@email.com" 
            />
            <Input 
              label="Endereço Completo *" 
              placeholder="Rua, número, bairro e cidade" 
              className="md:col-span-2"
              isTextArea
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Ações combinando com suas variantes de botão */}
      <div className="flex justify-end gap-4 mt-10">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button variant="primary" icon={Save} onClick={() => alert("Pronto para enviar para a API!")}>
          Salvar Paciente
        </Button>
      </div>
    </div>
  );
};

export default NovoPaciente;
