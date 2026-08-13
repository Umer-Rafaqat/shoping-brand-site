import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ─── In-memory token store ────────────────────────────────────────────────────
let _accessToken = localStorage.getItem("accessToken");

export const setAccessToken = (token) => {
  _accessToken = token;
  localStorage.setItem("accessToken", token);
};
export const getAccessToken = () => _accessToken;

export const clearAccessToken = () => {
  _accessToken = null;
  localStorage.removeItem("accessToken");
};

// ─── Request interceptor — attach access token ────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
    }
    return Promise.reject(error);
  },
);

export default api;
