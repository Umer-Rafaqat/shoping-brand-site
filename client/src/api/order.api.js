import api from "./axiosInstance";

export const createOrderAPI = async (shippingAddress) => {
  const { data } = await api.post("/orders", { shippingAddress });
  return data.order;
};

export const getMyOrdersAPI = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get("/orders", { params: { page, limit } });
  return data;
};

export const getMyOrderByIdAPI = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
};

export const cancelMyOrderAPI = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data.order;
};
