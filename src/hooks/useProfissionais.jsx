import { useState, useCallback } from 'react';
import * as profissionaisService from '../services/profissionaisService';

export const useProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

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

  const carregarProfissionalPorId = useCallback(async (id) => {
    setCarregando(true);
    setErro(null);
    setProfissionalSelecionado(null);

    const resultado = await profissionaisService.listarProfissionais();

    if (resultado.error) {
      setErro(resultado.message);
      setCarregando(false);
      return;
    }

    const lista = resultado.data || [];

    setProfissionais(lista);

    const profissional = lista.find(
      (p) => String(p.id) === String(id)
    );

    if (profissional) {
      setProfissionalSelecionado(profissional);
    } else {
      setErro('Profissional não encontrado.');
    }

    setCarregando(false);
  }, []);

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

  const excluirProfissional = async (id) => {
    if (!window.confirm('Remover este profissional do sistema?')) return;

    setCarregando(true);
    setErro(null);

    const resultado = await profissionaisService.deletarProfissional(id);

    if (resultado.error) {
      setErro(resultado.message);
    } else {
      setProfissionais((prev) =>
        prev.filter((p) => String(p.id) !== String(id))
      );

      if (String(profissionalSelecionado?.id) === String(id)) {
        setProfissionalSelecionado(null);
      }
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

    dentistas: profissionais.filter((p) =>
      p.perfis?.includes('ROLE_DENTISTA')
    ),
  };
};