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

  getAllOrders: async (currency = "BRL", page = 0, size = 100, headers) => {
    return ordersApi.get("/ws/orders", {
      params: { targetCurrency: currency, page, size },
      headers: {
        "X-User-Id": headers.userId,
        "X-User-Email": headers.userEmail,
        "X-User-Type": headers.userType,
      },
    });
  },

  finalizeOrder: async (orderId, headers) => {
    return ordersApi.patch(`/ws/orders/${orderId}/finalize`, null, {
      headers: {
        "X-User-Id": headers.userId,
        "X-User-Email": headers.userEmail,
        "X-User-Type": headers.userType,
      },
    });
  },
};
