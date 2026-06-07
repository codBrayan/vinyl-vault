import React, { createContext, useState, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Adiciona item ou incrementa se já existir
  const addToCart = (produto) => {
    setCart((prevCart) => {
      const itemExiste = prevCart.find(item => item.id === produto.id);
      if (itemExiste) {
        return prevCart.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prevCart, { ...produto, quantidade: 1 }];
    });
  };

  // Remove o item completamente
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Altera quantidade diretamente (+ ou - no botão da tela de carrinho)
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

  // Limpa o carrinho ao finalizar compra
  const clearCart = () => setCart([]);

  // Cálculos performáticos automáticos (Sempre atualizam se o "cart" mudar)
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