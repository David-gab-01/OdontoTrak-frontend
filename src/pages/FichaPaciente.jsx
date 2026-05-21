import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  CircleDot,
  AlertCircle,
  Wrench,
} from 'lucide-react';

import { usePacientes } from '../hooks/usePacientes';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useOdontograma } from '../hooks/useOdontograma';
import { useAuth } from '../contexts/AuthContext';

import Loading from '../components/Loading';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import InfoCard from '../components/InfoCard';
import SectionCard from '../components/SectionCard';
import ProfileHeader from '../components/ProfileHeader';
import Odontograma from '../components/Odontograma';
import Modal from '../components/Modal';

const FichaPaciente = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();

  const perfisUsuario = user?.perfis || [];
  const isRecepcao = perfisUsuario.includes('ROLE_RECEPCIONISTA');

  const [activeTab, setActiveTab] = useState('ultimas');
  const [modal, setModal] = useState(null);

  const TAB_ITEMS = [
    { id: 'ultimas', label: 'Últimas Consultas' },

    ...(!isRecepcao
      ? [
          { id: 'odontograma', label: 'Odontograma' },
          { id: 'historico', label: 'Histórico Clínico' },
        ]
      : []),

    { id: 'dados', label: 'Dados pessoais' },
  ];

  const {
    pacienteSelecionado,
    carregando: carregandoPaciente,
    erro: erroPaciente,
    carregarPacientePorId,
  } = usePacientes();

  const {
    agendamentos,
    carregando: carregandoAgendamentos,
    carregarAgendamentosPorPaciente,
  } = useAgendamentos();

  const {
    dentes,
    setDentes,
    carregando: carregandoOdontograma,
    carregarUltimoPorPaciente,
    salvarOdontograma,
  } = useOdontograma();

  useEffect(() => {
    if (id) {
      carregarPacientePorId(id);
      carregarAgendamentosPorPaciente(id);

      if (!isRecepcao) {
        carregarUltimoPorPaciente(id);
      }
    }
  }, [
    id,
    isRecepcao,
    carregarPacientePorId,
    carregarAgendamentosPorPaciente,
    carregarUltimoPorPaciente,
  ]);

  useEffect(() => {
    if (isRecepcao && ['odontograma', 'historico'].includes(activeTab)) {
      setActiveTab('ultimas');
    }
  }, [isRecepcao, activeTab]);

  const agendamentosPaciente = useMemo(() => agendamentos || [], [agendamentos]);

  const totalConsultas = agendamentosPaciente.length;

  const consultasConcluidas = agendamentosPaciente.filter((item) =>
    ['CONCLUIDO', 'FINALIZADO', 'CONCLUIDA'].includes(
      item.statusConsulta?.toUpperCase()
    )
  ).length;

  const consultasEmAndamento = totalConsultas - consultasConcluidas;

  const idadePaciente = useMemo(() => {
    if (!pacienteSelecionado?.dataNascimento) return null;

    const nascimento = new Date(pacienteSelecionado.dataNascimento);
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
  }, [pacienteSelecionado?.dataNascimento]);

  const formatarDataHora = (iso) => {
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

  const handleSalvarOdontograma = async () => {
    if (isRecepcao) {
      setModal({
        type: 'error',
        message: 'A recepção não possui permissão para salvar odontograma.',
      });

      return;
    }

    const consultaAtual =
      agendamentosPaciente.find((item) =>
        ['EM_ANDAMENTO', 'AGENDADO'].includes(
          item.statusConsulta?.toUpperCase()
        )
      ) || agendamentosPaciente[0];

    if (!consultaAtual?.id) {
      setModal({
        type: 'error',
        message: 'Nenhuma consulta encontrada para salvar o odontograma.',
      });

      return;
    }

    setModal({
      type: 'loading',
      message: 'Salvando odontograma...',
    });

    const resultado = await salvarOdontograma({
      pacienteId: Number(id),
      agendamentoId: consultaAtual.id,
    });

    if (!resultado.error) {
      setModal({
        type: 'success',
        message: 'Odontograma salvo com sucesso!',
      });
    } else {
      setModal({
        type: 'error',
        message: resultado.message || 'Erro ao salvar odontograma.',
      });
    }
  };

  if (carregandoPaciente || carregandoAgendamentos) {
    return <Loading />;
  }

  if (erroPaciente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <AlertCircle size={48} className="text-red-500 mb-4" />

        <h2 className="text-xl font-bold text-dentista-title mb-2">
          Erro ao carregar paciente
        </h2>

        <p className="text-dentista-body">{erroPaciente}</p>

        <BackButton className="mt-4" />
      </div>
    );
  }

  if (!pacienteSelecionado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem]">
        <User size={48} className="text-gray-400 mb-4" />

        <h2 className="text-xl font-bold text-dentista-title mb-2">
          Paciente não encontrado
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
            Ficha Paciente
          </h1>
        </div>
      </div>

      <ProfileHeader
        title={pacienteSelecionado.nome}
        subtitle="Ficha Paciente"
        avatarText={pacienteSelecionado.nome?.charAt(0).toUpperCase() || 'P'}
        fields={[
          {
            label: 'Idade',
            value:
              idadePaciente !== null
                ? `${idadePaciente} anos`
                : 'Não informado',
          },
          {
            label: 'Telefone',
            value: pacienteSelecionado.telefone || 'Não informado',
          },
          {
            label: 'E-mail',
            value: pacienteSelecionado.email || 'Não informado',
          },
          {
            label: 'CPF',
            value: pacienteSelecionado.cpf || 'Não informado',
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
                Registros de consultas vinculadas a este paciente.
              </p>
            </div>

            {agendamentosPaciente.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-sm text-gray-500 text-left">
                      <th className="px-4 py-3">Paciente</th>
                      <th className="px-4 py-3">Data/Hora</th>
                      <th className="px-4 py-3">Profissional</th>
                      <th className="px-4 py-3">Etapa</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {agendamentosPaciente.map((consulta) => (
                      <tr key={consulta.id} className="bg-gray-50 rounded-3xl">
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-dentista-primary">
                              {consulta.nomePaciente?.charAt(0).toUpperCase() ||
                                pacienteSelecionado.nome
                                  ?.charAt(0)
                                  .toUpperCase() ||
                                'P'}
                            </div>

                            <div>
                              <p className="font-semibold text-dentista-title">
                                {consulta.nomePaciente || pacienteSelecionado.nome}
                              </p>

                              <p className="text-sm text-gray-500">
                                {consulta.pacienteTelefone ||
                                  pacienteSelecionado.telefone ||
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
                            `Dr(a). ${consulta.profissionalId || ''}`}
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
                            onClick={() =>
                              navigate(`/ficha-consulta/${consulta.id}`)
                            }
                          >
                            Ver Consulta
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-dentista-body">
                Nenhuma consulta encontrada para este paciente.
              </div>
            )}
          </>
        )}

        {activeTab === 'odontograma' && !isRecepcao && (
          <>
            {carregandoOdontograma ? (
              <Loading fullScreen={false} text="Carregando odontograma..." />
            ) : (
              <div className="space-y-6">
                <Odontograma dentes={dentes} onChange={setDentes} />

                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSalvarOdontograma}>
                    Salvar Odontograma
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'historico' && !isRecepcao && (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 bg-slate-50 rounded-[22px]">
            <Wrench size={40} className="text-gray-400 mb-3 animate-pulse" />

            <h4 className="font-semibold text-dentista-title mb-1">
              Módulo Histórico Clínico
            </h4>

            <p className="text-sm text-dentista-body text-center max-w-sm">
              Funcionalidade vinculada ao módulo de prontuários. Em desenvolvimento no backend.
            </p>
          </div>
        )}

        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionCard title="Informações Básicas">
              <div className="space-y-3 text-sm text-dentista-body">
                <p>
                  <span className="font-semibold">CPF:</span>{' '}
                  {pacienteSelecionado.cpf || 'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Data de nascimento:</span>{' '}
                  {pacienteSelecionado.dataNascimento || 'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Sexo:</span>{' '}
                  {pacienteSelecionado.sexo || 'Não informado'}
                </p>

                <p>
                  <span className="font-semibold">Cadastrado em:</span>{' '}
                  {pacienteSelecionado.criadoEm || 'Não informado'}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Contato">
              <div className="space-y-3 text-sm text-dentista-body">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-dentista-primary" />
                  {pacienteSelecionado.telefone || 'Não informado'}
                </p>

                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-dentista-primary" />
                  {pacienteSelecionado.email || 'Não informado'}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Endereço">
              <p className="text-sm text-dentista-body">
                {pacienteSelecionado.endereco || 'Endereço não informado'}
              </p>
            </SectionCard>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default FichaPaciente;