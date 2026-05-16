import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  CircleDot,
  AlertCircle,
  Download,
  Printer,
} from 'lucide-react';

import { useProfissionais } from '../hooks/useProfissionais';
import { useAgendamentos } from '../hooks/useAgendamentos';

import Loading from '../components/Loading';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import InfoCard from '../components/InfoCard';
import SectionCard from '../components/SectionCard';
import ProfileHeader from '../components/ProfileHeader';

const TAB_ITEMS = [
  { id: 'ultimas', label: 'Últimas Consultas' },
  { id: 'dados', label: 'Dados pessoais' },
];

const PerfilProfissional = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('ultimas');

  const {
    profissionalSelecionado,
    carregando: carregandoProfissional,
    erro: erroProfissional,
    carregarProfissionalPorId,
  } = useProfissionais();

  const {
    agendamentos,
    carregando: carregandoAgendamentos,
    carregarAgendamentos,
  } = useAgendamentos();

  useEffect(() => {
    if (id) {
      carregarProfissionalPorId(id);
      carregarAgendamentos();
    }
  }, [id, carregarProfissionalPorId, carregarAgendamentos]);

  const consultasProfissional = useMemo(() => {
    return agendamentos.filter(
      (consulta) => String(consulta.profissionalId) === String(id)
    );
  }, [agendamentos, id]);

  console.log('Consultas do profissional:', consultasProfissional);
  console.log('Profissional selecionado:', profissionalSelecionado);

  const totalConsultas = consultasProfissional.length;

  const consultasConcluidas = consultasProfissional.filter((item) =>
    ['CONCLUIDO', 'CONCLUIDA', 'FINALIZADO'].includes(
      item.statusConsulta?.toUpperCase()
    )
  ).length;

  const consultasEmAndamento = totalConsultas - consultasConcluidas;

  const idadeProfissional = useMemo(() => {
    if (!profissionalSelecionado?.dataNascimento) return null;

    const nascimento = new Date(profissionalSelecionado.dataNascimento);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();

    if (
      mesDiff < 0 ||
      (mesDiff === 0 && hoje.getDate() < nascimento.getDate())
    ) {
      idade -= 1;
    }

    return idade;
  }, [profissionalSelecionado?.dataNascimento]);

  const formatarDataHora = (iso) => {
    if (!iso) return 'Data indisponível';

    try {
      const data = new Date(iso);
      const dia = data.toLocaleDateString('pt-BR');
      const hora = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${dia} • ${hora}`;
    } catch {
      return 'Data indisponível';
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      CONCLUIDO: 'text-emerald-800 bg-emerald-100',
      FINALIZADO: 'text-emerald-800 bg-emerald-100',
      AGENDADO: 'text-sky-800 bg-sky-100',
      EM_ANDAMENTO: 'text-orange-800 bg-orange-100',
      PENDENTE: 'text-gray-600 bg-gray-100',
    };

    return classes[status?.toUpperCase()] || 'text-gray-600 bg-gray-100';
  };

  if (carregandoProfissional || carregandoAgendamentos) {
    return <Loading />;
  }

  if (erroProfissional) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-dentista-title mb-2">
          Erro ao carregar profissional
        </h2>
        <p className="text-dentista-body">{erroProfissional}</p>
        <BackButton className="mt-4" />
      </div>
    );
  }

  if (!profissionalSelecionado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <User size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-dentista-title mb-2">
          Profissional não encontrado
        </h2>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dentista-title">
            Perfil Profissional
          </h1>
        </div>
      </div>

      <ProfileHeader
        title={profissionalSelecionado.nome}
        subtitle="Perfil Profissional"
        avatarText={profissionalSelecionado.nome?.charAt(0).toUpperCase() || 'P'}
        fields={[
          {
            label: 'Idade',
            value:
              idadeProfissional !== null
                ? `${idadeProfissional} anos`
                : 'Não informado',
          },
          {
            label: 'Status',
            value: profissionalSelecionado.ativo ? 'Ativo' : 'Inativo',
          },
          {
            label: 'Registro Profissional',
            value: profissionalSelecionado.registroProfissional,
          },
          {
            label: 'E-mail',
            value: profissionalSelecionado.email,
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InfoCard
          title="Total de Consultas"
          value={totalConsultas}
          icon={CircleDot}
        />

        <InfoCard
          title="Consultas em andamento"
          value={consultasEmAndamento}
          icon={CircleDot}
          iconClassName="text-orange-500"
        />

        <InfoCard
          title="Consultas concluídas"
          value={consultasConcluidas}
          icon={CircleDot}
          iconClassName="text-emerald-500"
        />
      </div>

      <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-dentista-primary text-white'
                  : 'bg-gray-100 text-dentista-body hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-6">
        {activeTab === 'ultimas' && (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-dentista-title">
                Últimas Consultas
              </h3>
              <p className="text-sm text-dentista-body">
                Registros de consultas vinculadas a este profissional.
              </p>
            </div>

            {consultasProfissional.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="px-4 py-3 text-left">Paciente</th>
                      <th className="px-4 py-3 text-left">Data/Hora</th>
                      <th className="px-4 py-3 text-left">Profissional</th>
                      <th className="px-4 py-3 text-left">Etapa</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {consultasProfissional.map((consulta) => (
                      <tr key={consulta.id} className="bg-gray-50 rounded-3xl">
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-dentista-primary">
                              {consulta.nomePaciente?.charAt(0).toUpperCase() ||
                                'P'}
                            </div>

                            <div>
                              <p className="font-semibold text-dentista-title">
                                {consulta.nomePaciente || 'Paciente não informado'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {consulta.pacienteTelefone ||
                                  'Telefone não informado'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top text-gray-600 text-sm">
                          {formatarDataHora(consulta.dataInicio)}
                        </td>

                        <td className="px-4 py-4 align-top text-gray-600 text-sm">
                          {consulta.nomeProfissional ||
                            profissionalSelecionado.nome}
                        </td>

                        <td className="px-4 py-4 align-top text-sm">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {consulta.etapa ||
                              consulta.statusConsulta ||
                              'Agendado'}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-semibold ${getStatusBadge(
                              consulta.statusConsulta
                            )}`}
                          >
                            {consulta.statusConsulta?.replace('_', ' ') ||
                              'Pendente'}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-sm">
                          <Button
                            variant="outline"
                            onClick={() => navigate('/consultas')}
                          >
                            Ver Agenda
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-dentista-body">
                Nenhuma consulta encontrada para este profissional.
              </div>
            )}
          </>
        )}

        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Informações Básicas">
              <div className="space-y-3 text-sm text-dentista-body">
                <p>
                  <span className="font-semibold">CPF:</span>{' '}
                  {profissionalSelecionado.cpf || 'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Data de nascimento:</span>{' '}
                  {profissionalSelecionado.dataNascimento || 'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Registro Profissional:</span>{' '}
                  {profissionalSelecionado.registroProfissional ||
                    'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  {profissionalSelecionado.ativo ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Contato">
              <div className="space-y-3 text-sm text-dentista-body">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-dentista-primary" />
                  {profissionalSelecionado.telefone || 'Não informado'}
                </p>

                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-dentista-primary" />
                  {profissionalSelecionado.email || 'Não informado'}
                </p>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => window.location.reload()}>
          Atualizar Tela
        </Button>

        <Button variant="outline" onClick={() => navigate('/profissionais')}>
          Voltar para Profissionais
        </Button>
      </div>
    </div>
  );
};

export default PerfilProfissional;