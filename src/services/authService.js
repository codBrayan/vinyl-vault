import usersMock from './mocks/users.json' with { type: 'json' };

export const authService = {
  
  login: async (email, senha) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuario = usersMock.find(u => u.email === email && u.senha === senha);
        if (usuario) {
          const { senha, ...dadosUsuario } = usuario;
          resolve({ ...dadosUsuario});
        } else {
          reject(new Error("E-mail ou senha inválidos."));
        }
      }, 600);
    });
  },

  register: async (nome, email, senha) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExistente = usersMock.some(u => u.email === email);
        if (emailExistente) {
          reject(new Error("E-mail já cadastrado."));
        } else {
          const novoUsuario = {
            id: Date.now(),
            nome,
            email,
            senha,
            role: 'user'
          };
          console.log('Usuario adicionado: ', usersMock)
          usersMock.push(novoUsuario);
          const { senha, ...dadosUsuario } = novoUsuario;
          resolve(dadosUsuario);
        }
      }, 600);
    });
  }
};