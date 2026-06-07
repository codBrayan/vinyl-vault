import productsMock from './mocks/products.json' with { type: 'json' };

export const productService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsMock);
      }, 300);
    });
  },

  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const produto = productsMock.find(p => p.id === id);
        resolve(produto || null);
      }, 150);
    });
  }
};