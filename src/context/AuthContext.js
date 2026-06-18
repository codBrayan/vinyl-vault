import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [erro, setErro] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await AsyncStorage.getItem("@IntegrationCrud_userCredentials");
      if (response) {
        const dadosUsuario = JSON.parse(response);
        setUsuario(dadosUsuario);
      }
    } catch (error) {
      console.log("Erro ao carregar usuário automaticamente:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const dadosUsuario = await authService.login(email, senha);
      
      setUsuario(dadosUsuario);
      
      await AsyncStorage.setItem(
        "@IntegrationCrud_userCredentials",
        JSON.stringify(dadosUsuario),
      );
      return true;

    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("@IntegrationCrud_userCredentials");
      setUsuario(null);
    } catch (error) {
      console.error("Erro ao efetuar logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const dadosUsuario = await authService.register(nome, email, senha);
      
      setUsuario(dadosUsuario);

      await AsyncStorage.setItem(
        "@IntegrationCrud_userCredentials",
        JSON.stringify(dadosUsuario),
      );
      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, erro, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};