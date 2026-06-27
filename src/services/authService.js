import { authApi } from "./api";

export const authService = {
  login: async (email, senha) =>
    authApi.post("/auth/signin", { email, password: senha }),
  register: async (nome, email, senha) =>
    authApi.post("/auth/signup", { name: nome, email, password: senha }),
};
