import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, RefreshCw } from "lucide-react";
import ListContainer from "../components/ListContainer";
import ListItem from "../components/ListItem";
import Button from "../components/Button";
import Input from "../components/Input";
import { useProfissionais } from "../hooks/useProfissionais";

const Profissionais = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  
  const { 
    profissionais, 
    carregando, 
    carregarProfissionais, 
    excluirProfissional 
  } = useProfissionais();

  useEffect(() => {
    carregarProfissionais();
  }, [carregarProfissionais]);


  const filtrados = profissionais.filter(p => 
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
        
        <div className="flex gap-2">
          <Button variant="ghost" icon={RefreshCw} onClick={carregarProfissionais} loading={carregando} />
          <Button variant="primary" icon={UserPlus} onClick={() => navigate("/novo-profissional")}>
            Novo Profissional
          </Button>
        </div>
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
        {carregando ? (
          <div className="text-center py-10">Carregando equipe...</div>
        ) : (
          filtrados.map((p) => (
            <ListItem 
              key={p.id}
              title={p.nome}
              description={p.email}
              badgeText={p.registroProfissional || "N/A"}
              badgeColor="text-gray-500 bg-gray-50 border-gray-100"
              actionLabel="Gerenciar"
              onAction={() => navigate(`/perfil-profissional/${p.id}`)}
            />
          ))
        )}
        
        {!carregando && filtrados.length === 0 && (
          <div className="text-center py-10 text-gray-400">Nenhum profissional encontrado.</div>
        )}
      </ListContainer>
    </div>
  );
};

export default Profissionais;