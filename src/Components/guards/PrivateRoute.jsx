import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AcessoNegado from '../../pages/AcessoNegado'; 

const PrivateRoute = ({ allowedRoles }) => {
  const { authenticated, loading, user } = useAuth();

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se tentar acessar via URL 
  if (allowedRoles && !allowedRoles.some(role => user?.perfis?.includes(role))) {
    return <AcessoNegado />;
  }

  return <Outlet />;
};

export default PrivateRoute;