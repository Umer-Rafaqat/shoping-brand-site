import { newArrivals, topSelling, relatedProducts } from "@/data/products";

const baseProducts = [...newArrivals, ...topSelling, ...relatedProducts];

const TOTAL = 90;

export const categoryProducts = Array.from({ length: TOTAL }, (_, i) => {
  const base = baseProducts[i % baseProducts.length];
  return { ...base, id: i + 1 };
});
