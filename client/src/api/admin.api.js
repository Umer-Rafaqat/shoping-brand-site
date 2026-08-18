import api from "./axiosInstance";

export const getUsersAPI = async ({ page = 1, search = "" } = {}) => {
  const { data } = await api.get("/admin/users", { params: { page, search } });
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
