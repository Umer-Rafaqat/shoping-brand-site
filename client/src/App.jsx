import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

export default function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}
