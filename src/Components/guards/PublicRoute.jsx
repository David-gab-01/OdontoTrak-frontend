import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = () => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  // Se estiver logado e tentar ir pro login, manda pra home
  return !authenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;