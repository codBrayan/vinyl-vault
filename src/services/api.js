import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_IP = "192.168.101.6";

const createClient = (porta, requiresAuth = false) => {
  const client = axios.create({
    baseURL: `http://${BASE_IP}:${porta}`,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.log("[Global Error]: ", error);
      const mensagem =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        "Erro inesperado. Tente novamente.";
      return Promise.reject(new Error(mensagem));
    },
  );

  if (requiresAuth) {
    client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem("@VinylVault_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return client;
};

export const authApi = createClient(8900);
export const productsApi = createClient(8765, true);
export const cartApi = createClient(8082, true);
