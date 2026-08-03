import { newArrivals, topSelling, relatedProducts } from "@/data/products";

const baseProducts = [...newArrivals, ...topSelling, ...relatedProducts];

// The design shows a large catalog (100 products / 10 pages) but we only
// have a handful of real product entries — cycle through them, giving
// each repeat a unique id, so pagination has something real to page
// through. Swap this for a real API/catalog once one exists.
const TOTAL = 90;

export const categoryProducts = Array.from({ length: TOTAL }, (_, i) => {
  const base = baseProducts[i % baseProducts.length];
  return { ...base, id: i + 1 };
});