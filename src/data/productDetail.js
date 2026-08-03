
import mainImg from "../assets/product-detail/main.png";

import thumb2 from "../assets/product-detail/thumb-2.png";
import thumb3 from "../assets/product-detail/thumb-3.png";

export const productDetail = {
  slug: "one-life-graphic-tshirt",
  name: "ONE LIFE GRAPHIC T-SHIRT",
  rating: 4.5,
  reviewCount: 451,
  price: 260,
  oldPrice: 300,
  discount: "-40%",
  description:
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
  images: [mainImg,  thumb2, thumb3],
  colors: [
    { id: "olive", value: "#4A4A3A" },
    { id: "green", value: "#2B4A3E" },
    { id: "navy", value: "#2B3A55" },
  ],
  sizes: ["Small", "Medium", "Large", "X-Large"],
  breadcrumb: ["Home", "Shop", "Men", "T-shirts"],
};
