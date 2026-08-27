import api from "./axiosInstance";

export const getPublicProductsAPI = async ({
  page = 1,
  limit,
  search = "",
  category = "",
  minPrice,
  maxPrice,
  colors = [],
  sizes = [],
  sort = "newest",
  exclude = [],
} = {}) => {
  const { data } = await api.get("/products", {
    params: {
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      colors: colors.join(","),
      sizes: sizes.join(","),
      sort,
      exclude: exclude.join(","),
    },
  });
  return data;
};

export const getPublicProductByIdAPI = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
};

export const getPublicCategoriesAPI = async () => {
  const { data } = await api.get("/categories");
  return data.categories;
};
