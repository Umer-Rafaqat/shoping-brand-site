import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";

export default function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}
