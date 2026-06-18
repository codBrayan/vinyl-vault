import ordersMock from './mocks/orders.json';

let ordersDB = [...ordersMock];

export const orderService = {
  createOrder: async (userId, userName, userEmail, cartItems, totalAmount) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const itensFormatados = cartItems
            .map(item => `${item.quantidade}x ${item.titulo || item.nome}`)
            .join(', ');

          const newOrder = {
            id: Math.floor(1000 + Math.random() * 9000).toString(),
            data: new Date().toLocaleDateString('pt-BR'),
            userId,
            cliente: userName,
            emailCliente: userEmail,
            total: totalAmount,
            itens: itensFormatados,
            status: 'Pendente'
          };

          ordersDB.unshift(newOrder); 
          resolve(newOrder);
        } catch (error) {
          reject(new Error("Falha ao processar o pedido."));
        }
      }, 800); 
    });
  },

  getUserOrders: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userOrders = ordersDB.filter(order => order.userId === userId);
        resolve(userOrders);
      }, 400);
    });
  },

  getAllOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...ordersDB]);
      }, 400);
    });
  },

  updateOrderStatus: async (orderId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        ordersDB = ordersDB.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        resolve(true);
      }, 500);
    });
  }
};