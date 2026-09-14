import api from "./axiosInstance";

export const getCartAPI = async () => {
  const { data } = await api.get("/cart");
  return data.items;
};

export const addToCartAPI = async ({
  productId,
  size,
  color,
  quantity = 1,
}) => {
  const { data } = await api.post("/cart", {
    productId,
    size,
    color,
    quantity,
  });
  return data.items;
};

export const updateCartItemAPI = async (itemId, quantity) => {
  const { data } = await api.put(`/cart/${itemId}`, { quantity });
  return data.items;
};

export const removeCartItemAPI = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data.items;
};
