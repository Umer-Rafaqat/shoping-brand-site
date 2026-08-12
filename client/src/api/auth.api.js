import api, { setAccessToken, clearAccessToken } from "./axiosInstance";

export const signupAPI = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/signup", { name, email, password });
  setAccessToken(data.accessToken);
  return data;
};

export const loginAPI = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  setAccessToken(data.accessToken);
  return data;
};

export const logoutAPI = async () => {
  await api.post("/auth/logout");
  clearAccessToken();
};

export const getMeAPI = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};
