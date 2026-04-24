import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";

const Pacientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  const pacientesData = [
    {
      id: 1,
      nome: "João Frango",
      cpf: "000.000.000-01",
      email: "paciente@email.com",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      cpf: "000.000.000-02",
      email: "paciente2@email.com",
    },
    {
      id: 3,
      nome: "Carlos Eduardo",
      cpf: "000.000.002-22",
      email: "paciente22@email.com",
    }
  ];

  const pacientesFiltrados = pacientesData.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.includes(busca)
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">Pacientes</h1>
          <p className="text-dentista-body opacity-70">
            Gerenciamento de prontuários e cadastros.
          </p>
        </div>

        <Button 
          variant="primary" 
          icon={UserPlus} 
          onClick={() => navigate("/novo-paciente")}
        >
          Novo Paciente
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input
          label="Pesquisar"
          placeholder="Digite o nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1"
        />
        <Button variant="secondary" icon={Search}>
          Buscar
        </Button>
      </div>

      {/* --- MUDANÇA AQUI: ListContainer agora abraça os ListItems --- */}
      <ListContainer
        columns={{
          col1: "Paciente / CPF",
          col2: "E-mail de Contato", // Mudamos o título da coluna
          col3: "Ações"
        }}
      >
        {pacientesFiltrados.map((paciente) => (
          <ListItem
            key={paciente.id}
            title={paciente.nome}
            description={paciente.cpf}
            badgeText={paciente.email} // O e-mail entra no lugar do status
            badgeColor="text-gray-500 bg-gray-50 border-gray-100" // Cor neutra
            actionLabel="Abrir Prontuário"
            onAction={() => console.log("ID:", paciente.id)}
          />
        ))}

        {pacientesFiltrados.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Nenhum paciente encontrado com "{busca}".
          </div>
        )}
      </ListContainer>
    </div>
  );
};

export default Pacientes;