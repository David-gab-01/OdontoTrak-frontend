import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredToken = localStorage.getItem('@OdontoTrack:token');

    if (recoveredToken) {
      try {
        const decoded = jwtDecode(recoveredToken);
        
        // Validação de Expiração (exp está em segundos)
        const tempoAtual = Date.now() / 1000;
        if (decoded.exp < tempoAtual) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem('@OdontoTrack:token', token);
    setUser(decoded); // Agora o user tem { sub, role, exp, etc }
  };

  const logout = () => {
    localStorage.removeItem('@OdontoTrack:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);