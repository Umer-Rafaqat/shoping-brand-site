import { useMemo, useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product-detail/Breadcrumb";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import {
  initialCartItems,
  DELIVERY_FEE,
  DEFAULT_DISCOUNT_PERCENT,
  PROMO_CODES,
} from "@/data/cart";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

export default function Cart() {
  const [items, setItems] = useState(initialCartItems);
  const [discountPercent, setDiscountPercent] = useState(
    DEFAULT_DISCOUNT_PERCENT,
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handleQuantityChange = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (code) => {
    const upper = code.toUpperCase();
    if (PROMO_CODES[upper] != null) {
      setDiscountPercent(PROMO_CODES[upper]);
      return true;
    }
    return false;
  };

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb items={["Home", "Cart"]} />

        <h1 className="mb-8 font-integral text-3xl font-bold uppercase sm:text-4xl">
          Your Cart
        </h1>

        {items.length > 0 ? (
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="divide-y divide-black/10 rounded-2xl border border-black/10 px-6 lg:flex-1">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="lg:w-[380px]">
              <OrderSummary
                subtotal={subtotal}
                discountPercent={discountPercent}
                deliveryFee={DELIVERY_FEE}
                onApplyPromo={handleApplyPromo}
              />
            </div>
          </div>
        ) : (
          <div className="mb-16 flex flex-col items-center gap-3 rounded-2xl border border-black/10 py-20 text-center">
            <p className="font-satoshi text-base text-black/60">
              Your cart is empty.
            </p>
          </div>
        )}
      </div>

      <div className="-mb-20 relative z-10 mt-16">
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}
