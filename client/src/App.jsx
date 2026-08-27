import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import Account from "@/pages/Account";
import AdminRoute from "@/components/auth/AdminRoute";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Products from "@/pages/admin/Products";

export default function App() {
  return (
    <div className="w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<Category />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </div>
  );
}
