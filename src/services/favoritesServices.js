import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = (userId) => `@VinylVault_favorites_${userId}`;

const loadFavorites = async (userId) => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY(userId));
  return json ? JSON.parse(json) : [];
};

const saveFavorites = async (userId, favorites) => {
  await AsyncStorage.setItem(FAVORITES_KEY(userId), JSON.stringify(favorites));
};

export const favoritesService = {
  getFavorites: async (userId) => {
    return loadFavorites(userId);
  },

  checkIsFavorite: async (userId, productId) => {
    const favorites = await loadFavorites(userId);
    return favorites.some((p) => p.id === productId);
  },

  addFavorite: async (userId, product) => {
    const favorites = await loadFavorites(userId);
    const jaExiste = favorites.some((p) => p.id === product.id);
    if (!jaExiste) {
      await saveFavorites(userId, [...favorites, product]);
    }
    return true;
  },

  removeFavorite: async (userId, productId) => {
    const favorites = await loadFavorites(userId);
    await saveFavorites(
      userId,
      favorites.filter((p) => p.id !== productId),
    );
    return true;
  },
};
