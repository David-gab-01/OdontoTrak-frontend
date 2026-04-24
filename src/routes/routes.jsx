import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/guards/PrivateRoute";
import PublicRoute from "../components/guards/PublicRoute";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Pacientes from "../pages/Pacientes";
import FichaPaciente from "../pages/FichaPaciente";
import Agenda from "../pages/Agenda";
import Consultas from "../pages/Consultas";
import Profissionais from "../pages/Profissionais";
import RelatorioFinancas from "../pages/RelatorioFinancas";
import RelatorioConsultas from "../pages/RelatorioConsultas";
import NovoPaciente from "../pages/NovoPaciente";
import NovaConsulta from "../pages/NovaConsulta";
import NovoProfissional from "../pages/NovoProfissional";
import PerfilProfissional from "../pages/PerfilProfissional";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ROTAS PRIVADAS: Só acessa se estiver logado */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="consultas" element={<Consultas />} />
          <Route path="profissionais" element={<Profissionais />} />
          <Route path="relatorio-financas" element={<RelatorioFinancas />} />
          <Route path="relatorio-consultas" element={<RelatorioConsultas />} />
          <Route path="novo-paciente" element={<NovoPaciente />} />
          <Route path="nova-consulta" element={<NovaConsulta />} />
          <Route path="novo-profissional" element={<NovoProfissional />} />
          <Route path="ficha-paciente/:id" element={<FichaPaciente />} />
          <Route path="perfil-profissional" element={<PerfilProfissional />} />
        </Route>
      </Route>

      {/* ROTAS PÚBLICAS: Se estiver logado, é redirecionado para fora daqui */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;