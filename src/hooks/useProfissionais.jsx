import { useState, useCallback } from 'react';
import * as profissionaisService from '../services/profissionaisService';

export const useProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null); // Corrigido nomenclatura para bater com o estado
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Lista todos os profissionais cadastrados
  const carregarProfissionais = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const resultado = await profissionaisService.listarProfissionais();
    
    if (resultado.error) {
      setErro(resultado.message);
      setProfissionais([]);
    } else {
      setProfissionais(resultado.data || []);
    }
    setCarregando(false);
  }, []);

  // Busca detalhes de um profissional específico por ID
  const carregarProfissionalPorId = useCallback(async (id) => {
    if (!id) return;
    
    setCarregando(true);
    setErro(null);
    setProfissionalSelecionado(null);

    const resultado = await profissionaisService.buscarProfissionalPorId(id);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      setProfissionalSelecionado(resultado.data);
    }
    setCarregando(false);
  }, []);

  // Salva (Cria ou Atualiza) um profissional
  const salvarProfissional = async (dados) => {
    setCarregando(true);
    setErro(null);
    
    const resultado = dados.id
      ? await profissionaisService.atualizarProfissional(dados)
      : await profissionaisService.criarProfissional(dados);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      await carregarProfissionais();
    }
    
    setCarregando(false);
    return resultado;
  };

  // Exclui um profissional pelo ID
  const excluirProfissional = async (id) => {
    if (!window.confirm('Remover este profissional do sistema?')) return { error: true };
    
    setCarregando(true);
    setErro(null);
    const resultado = await profissionaisService.deletarProfissional(id);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      // Remove da lista local de forma reativa
      setProfissionais((prev) => prev.filter((p) => String(p.id) !== String(id)));
      
      // Limpa o perfil selecionado caso o usuário excluído seja o que estava em exibição
      setProfissionalSelecionado((atual) => {
        if (atual && String(atual.id) === String(id)) return null;
        return atual;
      });
    }
    
    setCarregando(false);
    return resultado;
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
    dentistas: profissionais.filter((p) => p.perfis?.includes('ROLE_DENTISTA')),
  };
};