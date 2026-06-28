import { productsApi } from "./api";
import productsMock from "./mocks/products.json"; // Ajuste o import conforme a sintaxe que estiver usando

let produtosMemoria = [...productsMock];
let produtosDeletadosMemoria = [];

export const productService = {
  getAll: async (page = 0, size = 25, currency = "BRL") => {
    return productsApi.get("/products", {
      params: { targetCurrency: currency, page, size },
    });
  },

  create: async (novoProduto, headers) => {
    return productsApi.post(
      "/ws/products",
      {
        title: novoProduto.title,
        artist: novoProduto.artist,
        releaseDate: novoProduto.releaseDate,
        genre: novoProduto.genre,
        category: novoProduto.category,
        currency: novoProduto.currency,
        price: parseFloat(novoProduto.price),
        imageURL: novoProduto.imageURL,
        description: novoProduto.description,
      },
      {
        headers: {
          "X-User-Id": headers.userId,
          "X-User-Email": headers.userEmail,
          "X-User-Type": headers.userType,
        },
      },
    );
  },

  update: async (id, dadosAtualizados, headers) => {
    return productsApi.put(
      `/ws/products/${id}`,
      {
        title: dadosAtualizados.title,
        artist: dadosAtualizados.artist,
        releaseDate: dadosAtualizados.releaseDate,
        genre: dadosAtualizados.genre,
        category: dadosAtualizados.category,
        currency: dadosAtualizados.currency,
        price: parseFloat(dadosAtualizados.price),
        imageURL: dadosAtualizados.imageURL,
        description: dadosAtualizados.description,
      },
      {
        headers: {
          "X-User-Id": headers.userId,
          "X-User-Email": headers.userEmail,
          "X-User-Type": headers.userType,
        },
      },
    );
  },

  delete: async (id, headers) => {
    return productsApi.delete(`/ws/products/${id}`, {
      headers: {
        "X-User-Id": headers.userId,
        "X-User-Email": headers.userEmail,
        "X-User-Type": headers.userType,
      },
    });
  },
  getDeleted: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...produtosDeletadosMemoria]), 400);
    });
  },

  restore: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const produtoParaRestaurar = produtosDeletadosMemoria.find(
          (p) => p.id === id,
        );
        if (produtoParaRestaurar) {
          produtosMemoria.unshift(produtoParaRestaurar);
        }
        produtosDeletadosMemoria = produtosDeletadosMemoria.filter(
          (p) => p.id !== id,
        );
        resolve(true);
      }, 400);
    });
  },
};
