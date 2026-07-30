import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";

export default function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}
