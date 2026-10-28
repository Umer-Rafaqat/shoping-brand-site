import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product-detail/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { createOrderAPI, createCheckoutSessionAPI } from "@/api/order.api";
import { DELIVERY_FEE } from "@/data/cart";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { items, loading: cartLoading, refreshCart } = useCart();

  const [form, setForm] = useState(emptyAddress);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");

  const wasCancelled = searchParams.get("cancelled") === "1";

  // Reset loading state if the browser restores the page
  // after the user presses Back from Stripe.
  useEffect(() => {
    const onShow = (e) => {
      if (e.persisted) {
        setPlacing(false);
      }
    };

    window.addEventListener("pageshow", onShow);

    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Guard against landing here with nothing to check out.
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartLoading, items.length, navigate]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = subtotal + DELIVERY_FEE;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!form.addressLine.trim()) {
      nextErrors.addressLine = "Address is required.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!form.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setFormError("");
    setPlacing(true);

    try {
      if (paymentMethod === "STRIPE") {
        const url = await createCheckoutSessionAPI(form);

        window.location.assign(url);

        // Stay in "placing" state while the browser leaves
        // the current page and redirects to Stripe.
        return;
      }

      const order = await createOrderAPI(form);

      await refreshCart();

      navigate("/orders", {
        replace: true,
        state: { justPlacedOrderNumber: order.orderNumber },
      });
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        const mapped = {};

        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });

        setErrors(mapped);
      } else {
        setFormError(data?.message || "Couldn't place your order. Try again.");
      }

      setPlacing(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-black/40 ${
      errors[field] ? "border-red-400" : "border-black/15"
    }`;

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb items={["Home", "Cart", "Checkout"]} />

        <h1 className="mb-8 font-integral text-3xl font-bold uppercase sm:text-4xl">
          Checkout
        </h1>

        <form
          onSubmit={handlePlaceOrder}
          className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start"
        >
          {/* Shipping details */}
          <fieldset
            disabled={placing}
            className="flex-1 rounded-2xl border border-black/10 p-6 disabled:opacity-60"
          >
            <p className="mb-4 text-base font-semibold">Shipping Details</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Full name
                </label>

                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Jane Doe"
                  className={inputClass("fullName")}
                />

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Phone number
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="03xx-xxxxxxx"
                  className={inputClass("phone")}
                />

                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Address
                </label>

                <input
                  type="text"
                  value={form.addressLine}
                  onChange={handleChange("addressLine")}
                  placeholder="House no, street, area"
                  className={inputClass("addressLine")}
                />

                {errors.addressLine && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.addressLine}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/50">
                    City
                  </label>

                  <input
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    placeholder="Multan"
                    className={inputClass("city")}
                  />

                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-black/50">
                    Postal code
                  </label>

                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange("postalCode")}
                    placeholder="60000"
                    className={inputClass("postalCode")}
                  />

                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment cancelled message */}
              {wasCancelled && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  Payment was cancelled. Your cart is still saved.
                </p>
              )}

              {/* Payment method */}
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-xs font-medium text-black/50">
                  Payment method
                </p>

                {[
                  {
                    value: "STRIPE",
                    label: "Pay by card (Stripe)",
                  },
                  {
                    value: "COD",
                    label: "Cash on Delivery",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      paymentMethod === opt.value
                        ? "border-black"
                        : "border-black/15"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />

                    <div>
                      <span>{opt.label}</span>
                      {opt.value === "COD" && (
                        <p className="mt-1 text-xs text-black/45">
                          Stripe promotion codes aren&apos;t available for Cash
                          on Delivery.
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Order summary */}
          <div className="lg:w-[380px]">
            <div className="rounded-2xl border border-black/10 p-5">
              <h2 className="font-satoshi text-xl font-bold">Order Summary</h2>

              <div className="mt-5 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-black/60">
                      {item.name}{" "}
                      <span className="text-black/40">x{item.quantity}</span>
                    </span>

                    <span className="font-medium">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-black/10" />

              <div className="flex flex-col gap-3 font-satoshi text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-black/50">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-black/50">Delivery Fee</span>
                  <span className="font-medium">${DELIVERY_FEE}</span>
                </div>
              </div>

              <div className="my-5 border-t border-black/10" />

              <div className="flex items-center justify-between">
                <span className="font-satoshi text-base">Total</span>

                <span className="font-satoshi text-xl font-bold">${total}</span>
              </div>

              {formError && (
                <p className="mt-4 text-sm text-red-500">{formError}</p>
              )}

              <button
                type="submit"
                disabled={placing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {placing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {paymentMethod === "STRIPE"
                      ? "Redirecting..."
                      : "Placing Order..."}
                  </>
                ) : paymentMethod === "STRIPE" ? (
                  "Pay with Card"
                ) : (
                  "Place Order"
                )}
              </button>

              {paymentMethod === "STRIPE" && (
                <p className="mt-2 text-center text-xs text-black/50">
                  Have a promo code? You can enter it on the next page.
                </p>
              )}

              <Link
                to="/cart"
                className="mt-3 block text-center text-xs text-black/50 hover:text-black"
              >
                Back to cart
              </Link>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
