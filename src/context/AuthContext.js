import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService.js";

export const AuthContext = createContext();

const STORAGE_KEY = "@VinylVault_userCredentials";
const TOKEN_KEY = "@VinylVault_token";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const [credJson, token] = await AsyncStorage.multiGet([
        STORAGE_KEY,
        TOKEN_KEY,
      ]);
      if (credJson[1]) setUsuario(JSON.parse(credJson[1]));
    } catch (error) {
      console.log("Erro ao carregar usuário:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const { user, token } = await authService.login(email, senha);
      console.log("USER", { user, token });

      const dadosUsuario = {
        id: user.id,
        nome: user.name,
        email: user.email,
        role: user.type,
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(dadosUsuario)],
        [TOKEN_KEY, token],
      ]);

      setUsuario(dadosUsuario);
      return true;
    } catch (err) {
      console.error("[Login - Auth Error]: ", err);
      setErro(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome, email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      await authService.register(nome, email, senha);
      return await login(email, senha);
    } catch (err) {
      console.error("[Register - Auth Error]: ", err);
      setErro(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, TOKEN_KEY]);
      setUsuario(null);
    } catch (error) {
      console.error("Erro ao efetuar logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, loading, erro, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
