import api from "./axiosInstance";

export const signupAPI = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/signup", { name, email, password });
  return data;
};

export const loginAPI = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const logoutAPI = async () => {
  await api.post("/auth/logout");
};

export const getMeAPI = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

// ─── My Account (CRUD) ───────────────────────────────────────

export const updateProfileAPI = async ({ name, email }) => {
  const { data } = await api.put("/auth/me", { name, email });
  return data.user;
};

export const updateAdminProfileAPI = async (payload) => {
  const { data } = await api.put("/auth/admin-profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.user;
};

export const changePasswordAPI = async ({ currentPassword, newPassword }) => {
  const { data } = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};

export const deleteAccountAPI = async ({ password }) => {
  const { data } = await api.delete("/auth/me", { data: { password } });
  return data;
};
