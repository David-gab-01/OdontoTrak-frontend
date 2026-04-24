import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";

const Profissionais = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Dados mockados baseados no retorno da sua API
  const profissionaisData = [
    {
      id: 1,
      nome: "Administrador do Sistema",
      email: "admin@odontotrack.com",
      cpf: "000.000.000-00",
      registroProfissional: "ADM-001",
      ativo: true
    },
    {
      id: 2,
      nome: "Dra. Ana Beatriz",
      email: "ana.beatriz@odontotrack.com",
      cpf: "123.456.789-10",
      registroProfissional: "CRO-12345",
      ativo: true
    }
  ];

  const filtrados = profissionaisData.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.registroProfissional?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">Profissionais</h1>
          <p className="text-dentista-body opacity-70">Gerencie a equipe e permissões de acesso.</p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => navigate("/novo-profissional")}>
          Novo Profissional
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input 
          label="Pesquisar"
          placeholder="Nome ou Registro (CRO)..." 
          className="flex-1"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="secondary" icon={Search}>Buscar</Button>
      </div>

      <ListContainer columns={{ col1: "Profissional / E-mail", col2: "Registro Profissional", col3: "Ações" }}>
        {filtrados.map((p) => (
          <ListItem 
            key={p.id}
            title={p.nome}
            description={p.email}
            badgeText={p.registroProfissional || "N/A"}
            badgeColor="text-gray-500 bg-gray-50 border-gray-100"
            actionLabel="Gerenciar"
            onAction={() => console.log("Editando profissional:", p.id)}
          />
        ))}
      </ListContainer>
    </div>
  );
};

export default Profissionais;
