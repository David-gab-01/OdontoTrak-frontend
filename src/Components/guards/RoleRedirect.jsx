import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (user?.perfis?.includes("ROLE_DENTISTA")) {
    return <Navigate to="/dashboard-dentista" replace />;
  }

  // Admin e Recepcionista compartilham o Dashboard principal
  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;