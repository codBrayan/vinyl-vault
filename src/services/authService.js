import usersMock from './mocks/users.json' with { type: 'json' };

export const authService = {
  login: async (email, senha) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuario = usersMock.find(u => u.email === email && u.senha === senha);
        if (usuario) {
          const { senha, ...dadosUsuario } = usuario;
          resolve(dadosUsuario);
        } else {
          reject(new Error("E-mail ou senha inválidos."));
        }
      }, 600);
    });
  }
};