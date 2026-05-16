import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/guards/PrivateRoute";
import PublicRoute from "../components/guards/PublicRoute";
import RoleRedirect from "../components/guards/RoleRedirect";
import MainLayout from "../layouts/MainLayout";

// Páginas
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardDentista from "../pages/DashboardDentista";
import Pacientes from "../pages/Pacientes";
import FichaPaciente from "../pages/FichaPaciente";
import Agenda from "../pages/Agenda";
import Consultas from "../pages/Consultas";
import FichaConsulta from "../pages/FichaConsulta";
import Profissionais from "../pages/Profissionais";
import RelatorioFinancas from "../pages/RelatorioFinancas"; 
import RelatorioConsultas from "../pages/RelatorioConsultas";
import NovoPaciente from "../pages/NovoPaciente";
import NovaConsulta from "../pages/NovaConsulta";
import NovoProfissional from "../pages/NovoProfissional";
import PerfilProfissional from "../pages/PerfilProfissional";
import PerfilUser from "../pages/PerfilUser";
import AcessoNegado from "../pages/AcessoNegado";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. ROTAS PÚBLICAS */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
      </Route>

      {/* 2. ESTRUTURA PRIVADA */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          
          {/* O RoleRedirect decide se vai para /dashboard ou /dashboard-dentista */}
          <Route index element={<RoleRedirect />} />
          
          <Route path="perfil-user/:id" element={<PerfilUser />} />
          <Route path="acesso-negado" element={<AcessoNegado />} />

          {/* --- GRUPO A: DASHBOARDS ESPECÍFICOS --- */}
          <Route element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPCIONISTA']} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={['ROLE_DENTISTA']} />}>
            <Route path="dashboard-dentista" element={<DashboardDentista />} />
          </Route>

          {/* --- GRUPO B: ACESSO COMUM --- */}
          <Route element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DENTISTA', 'ROLE_RECEPCIONISTA']} />}>
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="ficha-paciente/:id" element={<FichaPaciente />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="consultas" element={<Consultas />} />
            <Route path="ficha-consulta/:id" element={<FichaConsulta />} />
          </Route>

          {/* --- GRUPO C: OPERAÇÃO --- */}
          <Route element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPCIONISTA']} />}>
            <Route path="novo-paciente" element={<NovoPaciente />} />
            <Route path="nova-consulta" element={<NovaConsulta />} />
          </Route>

          {/* --- GRUPO D: EXCLUSIVO ADMIN --- */}
          <Route element={<PrivateRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="profissionais" element={<Profissionais />} />
            <Route path="novo-profissional" element={<NovoProfissional />} />
            <Route path="perfil-profissional/:id" element={<PerfilProfissional />} />
            <Route path="relatorio-financas" element={<RelatorioFinancas />} />
            <Route path="relatorio-consultas" element={<RelatorioConsultas />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;