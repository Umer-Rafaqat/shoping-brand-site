import { newArrivals, relatedProducts } from "@/data/products";

// Reuse real product entries (image + price) instead of duplicating
// assets — matches whatever is shown elsewhere on the site.
const gradientTee = relatedProducts.find(
  (p) => p.name === "Gradient Graphic T-shirt",
);
const checkeredShirt = newArrivals.find((p) => p.name === "Checkered Shirt");
const skinnyJeans = newArrivals.find((p) => p.name === "Skinny Fit Jeans");

export const initialCartItems = [
  {
    id: 1,
    name: gradientTee.name,
    image: gradientTee.image,
    price: gradientTee.price,
    size: "Large",
    color: "White",
    quantity: 1,
  },
  {
    id: 2,
    name: checkeredShirt.name,
    image: checkeredShirt.image,
    price: checkeredShirt.price,
    size: "Medium",
    color: "Red",
    quantity: 1,
  },
  {
    id: 3,
    name: skinnyJeans.name,
    image: skinnyJeans.image,
    price: skinnyJeans.price,
    size: "Large",
    color: "Blue",
    quantity: 1,
  },
];

export const DELIVERY_FEE = 15;
export const DEFAULT_DISCOUNT_PERCENT = 20;

// Toy promo codes — swap for a real backend check when there is one.
export const PROMO_CODES = {
  SAVE10: 10,
  SAVE20: 20,
  SAVE30: 30,
};
