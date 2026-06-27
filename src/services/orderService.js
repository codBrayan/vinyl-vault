import { ordersApi } from "./api";

export const orderService = {
  createOrder: async (cartItems) => {
    const body = {
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantidade,
      })),
    };

    return ordersApi.post("/ws/orders", body);
  },

  getUserOrders: async (currency = "BRL", page = 0, size = 25) => {
    return ordersApi.get("/ws/orders", {
      params: { targetCurrency: currency, page, size },
    });
  },

  getAllOrders: async () => {
    return ordersApi.get("/ws/orders", {
      params: { targetCurrency: currency, page, size },
    });
  },

  finalizeOrder: async (orderId) => {
    return ordersApi.patch(`/ws/orders/${orderId}/finalize`);
  },
};
