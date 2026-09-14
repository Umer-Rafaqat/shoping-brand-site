import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
} from "@/api/cart.api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cart only makes sense for a logged-in user — load it right after login,
  // and clear it locally on logout (the server-side cart still exists, we
  // just stop showing it once nobody's authenticated to view it).
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    getCartAPI()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  const addToCart = useCallback(
    async ({ productId, size, color, quantity }) => {
      const updated = await addToCartAPI({ productId, size, color, quantity });
      setItems(updated);
    },
    [],
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const updated = await updateCartItemAPI(itemId, quantity);
    setItems(updated);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const updated = await removeCartItemAPI(itemId);
    setItems(updated);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
