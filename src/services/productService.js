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

  create: async (novoProduto) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const produtoFormatado = {
          id: Date.now().toString(),
          titulo: novoProduto.titulo,
          artista: novoProduto.artista,
          preco: parseFloat(novoProduto.preco),
          imagem: novoProduto.imagem || "https://via.placeholder.com/320",
          categoria: novoProduto.categoria || "Sem Categoria",
          descricao: novoProduto.descricao || "Sem descrição disponível.",
        };
        produtosMemoria.unshift(produtoFormatado);
        resolve(produtoFormatado);
      }, 400);
    });
  },

  update: async (id, dadosAtualizados) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        produtosMemoria = produtosMemoria.map((p) =>
          p.id === id
            ? {
                ...p,
                titulo: dadosAtualizados.titulo,
                artista: dadosAtualizados.artista,
                preco: parseFloat(dadosAtualizados.preco),
                imagem: dadosAtualizados.imagem,
                categoria: dadosAtualizados.categoria || p.categoria,
                descricao: dadosAtualizados.descricao || p.descricao,
              }
            : p,
        );
        resolve(true);
      }, 400);
    });
  },

  delete: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const produtoParaDeletar = produtosMemoria.find((p) => p.id === id);
        if (produtoParaDeletar) {
          produtosDeletadosMemoria.push(produtoParaDeletar);
        }

        produtosMemoria = produtosMemoria.filter((p) => p.id !== id);
        resolve(true);
      }, 400);
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
