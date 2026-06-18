
let favoritesDB = [];

export const favoritesService = {
  // Simula: GET /api/users/{userId}/favorites
  getFavorites: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userFavorites = favoritesDB
          .filter(fav => fav.userId === userId)
          .map(fav => fav.product);
        resolve(userFavorites);
      }, 300);
    });
  },
  checkIsFavorite: async (userId, productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = favoritesDB.some(fav => fav.userId === userId && fav.product.id === productId);
        resolve(exists);
      }, 100);
    });
  },
  addFavorite: async (userId, product) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        favoritesDB.push({ userId, product });
        resolve(true);
      }, 300);
    });
  },
  removeFavorite: async (userId, productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        favoritesDB = favoritesDB.filter(fav => !(fav.userId === userId && fav.product.id === productId));
        resolve(true);
      }, 300);
    });
  }
};