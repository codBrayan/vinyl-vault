import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext.js'; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext); 
  const [cart, setCart] = useState([]);

  const getCartKey = () => usuario ? `@vinyl_vault:cart_${usuario.id}` : null;

  useEffect(() => {
    async function loadStoredCart() {
      const key = getCartKey();
      if (!key) {
        setCart([]);
        return;
      }
      try {
        const storedData = await AsyncStorage.getItem(key);
        if (storedData) {
          setCart(JSON.parse(storedData));
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Erro ao carregar o carrinho do AsyncStorage:", error);
      }
    }
    loadStoredCart();
  }, [usuario]);

  useEffect(() => {
    async function saveCartToStorage() {
      const key = getCartKey();
      if (!key) return;

      try {
        await AsyncStorage.setItem(key, JSON.stringify(cart));
      } catch (error) {
        console.error("Erro ao salvar o carrinho no AsyncStorage:", error);
      }
    }

    if (usuario) {
      saveCartToStorage();
    }
  }, [cart, usuario]);

  const addToCart = (produto, quantidadeSelecionada = 1) => {
    setCart((prevCart) => {
      const itemExiste = prevCart.find(item => item.id === produto.id);
      if (itemExiste) {
        return prevCart.map(item =>
          item.id === produto.id ? {...item, quantidade: item.quantidade + quantidadeSelecionada} : item
        );
      }
      return [...prevCart, { ...produto, quantidade: quantidadeSelecionada}];
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantidade, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};