import tshirtTapeDetails from "../assets/products/tshirt-tape-details.png";
import skinnyFitJeans from "../assets/products/skinny-fit-jeans.png";
import checkeredShirt from "../assets/products/checkered-shirt.png";
import sleeveStripedTshirt from "../assets/products/sleeve-striped-tshirt.png";
import verticalStripedShirt from "../assets/products/vertical-striped-shirt.png";
import courageGraphicTshirt from "../assets/products/courage-graphic-tshirt.png";
import looseFitBermudaShorts from "../assets/products/loose-fit-bermuda-shorts.png";
import fadedSkinnyJeans from "../assets/products/faded-skinny-jeans.png";
import poloContrastTrims from "../assets/products/polo-contrast-trims.png";
import gradientGraphicTshirt from "../assets/products/gradient-graphic-tshirt.png";
import poloTippingDetails from "../assets/products/polo-tipping-details.png";
import blackStripedTshirt from "../assets/products/black-striped-tshirt.png";

export const newArrivals = [
  {
    id: 1,
    name: "T-shirt with Tape Details",
    image: tshirtTapeDetails,
    rating: 4.5,
    price: 120,
    oldPrice: null,
    discount: null,
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    image: skinnyFitJeans,
    rating: 3.5,
    price: 240,
    oldPrice: 260,
    discount: "-20%",
  },
  {
    id: 3,
    name: "Checkered Shirt",
    image: checkeredShirt,
    rating: 4.5,
    price: 180,
    oldPrice: null,
    discount: null,
  },
  {
    id: 4,
    name: "Sleeve Striped T-shirt",
    image: sleeveStripedTshirt,
    rating: 4.5,
    price: 130,
    oldPrice: 160,
    discount: "-30%",
  },
];

export const topSelling = [
  {
    id: 5,
    name: "Vertical Striped Shirt",
    image: verticalStripedShirt,
    rating: 5,
    price: 212,
    oldPrice: 232,
    discount: "-20%",
  },
  {
    id: 6,
    name: "Courage Graphic T-shirt",
    image: courageGraphicTshirt,
    rating: 4,
    price: 145,
    oldPrice: null,
    discount: null,
  },
  {
    id: 7,
    name: "Loose Fit Bermuda Shorts",
    image: looseFitBermudaShorts,
    rating: 3,
    price: 80,
    oldPrice: null,
    discount: null,
  },
  {
    id: 8,
    name: "Faded Skinny Jeans",
    image: fadedSkinnyJeans,
    rating: 4.5,
    price: 210,
    oldPrice: null,
    discount: null,
  },
];

export const relatedProducts = [
  {
    id: 9,
    name: "Polo with Contrast Trims",
    image: poloContrastTrims,
    rating: 4,
    price: 212,
    oldPrice: 242,
    discount: "-20%",
  },
  {
    id: 10,
    name: "Gradient Graphic T-shirt",
    image: gradientGraphicTshirt,
    rating: 3.5,
    price: 145,
    oldPrice: null,
    discount: null,
  },
  {
    id: 11,
    name: "Polo with Tipping Details",
    image: poloTippingDetails,
    rating: 4.5,
    price: 180,
    oldPrice: null,
    discount: null,
  },
  {
    id: 12,
    name: "Black Striped T-shirt",
    image: blackStripedTshirt,
    rating: 5,
    price: 120,
    oldPrice: 150,
    discount: "-30%",
  },
];

export const dressStyles = [
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "party", label: "Party" },
  { id: "gym", label: "Gym" },
];

export const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];
