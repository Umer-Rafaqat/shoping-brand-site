import api from "./axiosInstance";

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProductsAPI = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  size = "",
} = {}) => {
  const { data } = await api.get("/admin/products", {
    params: { page, limit, search, category, size },
  });
  return data;
};

export const getProductByIdAPI = async (productId) => {
  const { data } = await api.get(`/admin/products/${productId}`);
  return data.product;
};

export const createProductAPI = async (payload) => {
  const { data } = await api.post("/admin/products", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.product;
};

export const updateProductAPI = async (productId, payload) => {
  const { data } = await api.put(`/admin/products/${productId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.product;
};

export const deleteProductAPI = async (productId) => {
  await api.delete(`/admin/products/${productId}`);
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategoriesAPI = async () => {
  const { data } = await api.get("/admin/categories");
  return data.categories;
};

export const createCategoryAPI = async (name) => {
  const { data } = await api.post("/admin/categories", { name });
  return data.category;
};
