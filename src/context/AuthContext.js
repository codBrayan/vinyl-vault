import React, { createContext, useState } from 'react';
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const login = async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const dadosUsuario = await authService.login(email, senha);
      setUsuario(dadosUsuario);
      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading, erro }}>
      {children}
    </AuthContext.Provider>
  );
};