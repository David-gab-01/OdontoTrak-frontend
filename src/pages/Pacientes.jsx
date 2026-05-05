import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, RefreshCw } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";
import { usePacientes } from "../hooks/usePacientes";

const Pacientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Extraindo lógica do hook
  const { pacientes, carregando, carregarPacientes, excluirPaciente } = usePacientes();

  useEffect(() => {
    carregarPacientes();
  }, [carregarPacientes]);

  const normalizarTexto = (texto = "") => String(texto).toLowerCase().trim();
  const normalizarCpf = (valor = "") => String(valor).replace(/\D/g, "");
  const termoBusca = normalizarTexto(busca);
  const termoCpf = normalizarCpf(busca);
  const buscaNumerica = /\d/.test(busca);

  const pacientesFiltrados = pacientes.filter((p) => {
    if (!termoBusca && !termoCpf) {
      return true;
    }

    const nome = normalizarTexto(p.nome || p.name || p.nomeCompleto || '');
    const cpf = normalizarCpf(p.cpf || '');
    const email = normalizarTexto(p.email || p.emailPaciente || '');
    const telefone = normalizarTexto(p.telefone || p.telefonePaciente || '');
    const buscaCpfValida = buscaNumerica && termoCpf.length > 0 && cpf.includes(termoCpf);
    const buscaTextoValida = termoBusca.length > 0 && (nome.includes(termoBusca) || email.includes(termoBusca) || telefone.includes(termoBusca));

    return buscaTextoValida || buscaCpfValida;
  });

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dentista-title">Pacientes</h1>
          <p className="text-dentista-body opacity-70">
            Gerenciamento de prontuários e cadastros.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={carregarPacientes} loading={carregando}> </Button>
          <Button 
            variant="primary" 
            icon={UserPlus} 
            onClick={() => navigate("/novo-paciente")}
          >
            Novo Paciente
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-end">
        <Input
          label="Pesquisar"
          placeholder="Digite o nome, CPF, email ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          icon={Search}
          onClick={() => setBusca(busca.trim())}
        >
          Buscar
        </Button>
      </div>

      <ListContainer
        columns={{
          col1: "Paciente / CPF",
          col2: "E-mail de Contato",
          col3: "Ações"
        }}
      >
        {carregando ? (
          <div className="text-center py-10">Carregando pacientes...</div>
        ) : (
          pacientesFiltrados.map((paciente) => (
            <ListItem
              key={paciente.id}
              title={paciente.nome}
              description={paciente.cpf}
              badgeText={paciente.email}
              badgeColor="text-gray-500 bg-gray-50 border-gray-100"
              actionLabel="Abrir Prontuário"
              onAction={() => navigate(`/ficha-paciente/${paciente.id}`)}
            />
          ))
        )}

        {!carregando && pacientesFiltrados.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Nenhum paciente encontrado.
          </div>
        )}
      </ListContainer>
    </div>
  );
};

export default Pacientes;