import { useState, useCallback } from 'react';
import * as profissionaisService from '../services/profissionaisService';

export const useProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);


// usa a lista que veio do service para atualizar o estado local, e trata erros
  const carregarProfissionais = useCallback(async () => {
    setCarregando(true);
    const resultado = await profissionaisService.listarProfissionais();
    if (resultado.error) setErro(resultado.message);
    else setProfissionais(resultado.data);
    setCarregando(false);
  }, []);

// Salva um profissional (cria ou atualiza) e recarrega a lista
  const salvarProfissional = async (dados) => {
    setCarregando(true);
    const resultado = dados.id 
      ? await profissionaisService.atualizarProfissional(dados)
      : await profissionaisService.criarProfissional(dados);
    
    if (!resultado.error) await carregarProfissionais();
    setCarregando(false);
    return resultado;
  };

// Carrega os detalhes de um profissional por ID para edição ou visualização
  const carregarProfissionalPorId = useCallback(async (id) => { 
    setCarregando(true);
    setErro(null);
    const resultado = await profissionaisService.buscarProfissionalPorId(id);
    if (resultado.error) setErro(resultado.message);
    else setProfissionalSelecionado(resultado.data);
    setCarregando(false);
  }, []);

// Exclui um profissional e atualiza a lista
  const excluirProfissional = async (id) => {
    if (!window.confirm("Remover este profissional do sistema?")) return;
    setCarregando(true);
    const resultado = await profissionaisService.deletarProfissional(id);
    if (!resultado.error) {
      setProfissionais(prev => prev.filter(p => p.id !== id));
    }
    setCarregando(false);
  };

  return {
    profissionais,
    profissionalSelecionado,
    carregando,
    erro,
    carregarProfissionais,
    carregarProfissionalPorId,
    salvarProfissional,
    excluirProfissional,
    // Helper para filtrar apenas dentistas (ROLE_DENTISTA)
    dentistas: profissionais.filter(p => p.perfis?.includes('ROLE_DENTISTA'))
  };
};