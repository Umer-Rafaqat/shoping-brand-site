import api from "./axiosInstance";

export const getUsersAPI = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const { data } = await api.get("/admin/users", {
    params: { page, limit, search },
  });
  return data;
};

export const createUserAPI = async ({ name, email, password }) => {
  const { data } = await api.post("/admin/users", { name, email, password });
  return data.user;
};

export const updateUserAPI = async (userId, { name, email }) => {
  const { data } = await api.put(`/admin/users/${userId}`, { name, email });
  return data.user;
};

export const deleteUserAPI = async (userId) => {
  await api.delete(`/admin/users/${userId}`);
};

export const getCartActivityAPI = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await api.get("/admin/carts", { params: { page, limit } });
  return data;
};

export const getAllOrdersAPI = async ({
  page = 1,
  limit = 10,
  status = "",
} = {}) => {
  const { data } = await api.get("/admin/orders", {
    params: { page, limit, status },
  });
  return data;
};

export const getOrderByIdAdminAPI = async (id) => {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.order;
};

export const updateOrderStatusAPI = async (id, status) => {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data.order;
};
