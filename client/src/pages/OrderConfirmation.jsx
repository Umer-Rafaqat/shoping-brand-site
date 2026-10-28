import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { verifyPaymentAPI } from "@/api/order.api";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";
const MAX_VERIFY_ATTEMPTS = 10;

export default function OrderConfirmation() {
  const { id } = useParams();
  const { refreshCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    let stopped = false;
    let attempts = 0;
    let timer;

    const load = async () => {
      attempts += 1;

      try {
        const data = await verifyPaymentAPI(id);

        if (stopped) return;

        setOrder(data);
        setLoading(false);

        if (data.paymentStatus === "paid") {
          setVerificationError("");
          try {
            await refreshCart();
          } catch {
            setVerificationError(
              "Payment is confirmed, but your cart could not be refreshed.",
            );
          }
        } else if (
          data.paymentStatus === "unpaid" &&
          attempts < MAX_VERIFY_ATTEMPTS
        ) {
          timer = setTimeout(load, 2000);
        } else if (data.paymentStatus === "unpaid") {
          setVerificationError(
            "Payment is still being confirmed. Please refresh this page shortly.",
          );
        }
      } catch (err) {
        if (stopped) return;

        if (attempts < MAX_VERIFY_ATTEMPTS) {
          timer = setTimeout(load, 2000);
        } else {
          setLoading(false);
          setVerificationError(
            err.response?.data?.message ||
              "We couldn't verify your payment. Please refresh this page or contact support.",
          );
        }
      }
    };

    load();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [id, refreshCart]);

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div
        className={`${CONTAINER} flex flex-col items-center py-16 text-center`}
      >
        {loading ? (
          <p className="text-sm text-black/50">Loading...</p>
        ) : !order ? (
          <>
            <p className="text-sm text-black/50">
              {verificationError || "Order not found."}
            </p>

            <Link to="/" className="mt-4 text-sm font-medium underline">
              Back to home
            </Link>
          </>
        ) : (
          <>
            {/*
              Payment/order status copy.
              Stripe orders can initially be "unpaid" while the webhook
              is still processing, so the page polls until the status changes.
            */}
            {(() => {
              const isStripe = order.paymentMethod === "STRIPE";

              const copy = !isStripe
                ? {
                    title: "Order Placed!",
                    text: "Thanks for your order — we'll get it ready for delivery. Pay your rider cash when it arrives.",
                    payment: "Cash on Delivery",
                  }
                : order.paymentStatus === "paid"
                  ? {
                      title: "Payment Successful!",
                      text: "Thanks for your order — we've received your payment and are getting it ready.",
                      payment: "Paid by card",
                    }
                  : order.paymentStatus === "refunded"
                    ? {
                        title: "Order Refunded",
                        text: "An item sold out while you were paying, so your order was cancelled and fully refunded.",
                        payment: "Refunded",
                      }
                    : order.paymentStatus === "failed"
                      ? {
                          title: "Payment Failed",
                          text: "Your payment session expired. You have not been charged.",
                          payment: "Not paid",
                        }
                      : {
                          title: "Confirming Payment...",
                          text: "Hang tight, we're confirming your payment with Stripe.",
                          payment: "Pending",
                        };

              return (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={32} />
                  </span>

                  <h1 className="mt-6 font-integral text-2xl font-bold uppercase sm:text-3xl">
                    {copy.title}
                  </h1>

                  <p className="mt-2 max-w-md text-sm text-black/60">
                    {copy.text}
                  </p>

                  {verificationError && (
                    <p className="mt-3 max-w-md text-sm text-amber-700">
                      {verificationError}
                    </p>
                  )}

                  <div className="mt-8 w-full max-w-md rounded-2xl border border-black/10 p-6 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-black/50">
                        Order Number
                      </span>

                      <span className="text-sm font-bold">
                        #{order.orderNumber}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-black/50">
                        Total Amount
                      </span>

                      <span className="text-sm font-bold">
                        ${order.totalAmount}
                      </span>
                    </div>

                    {order.discountAmount > 0 && (
                      <div className="mt-3 flex items-center justify-between text-emerald-700">
                        <span className="text-sm">
                          Discount
                          {order.couponCode && ` (${order.couponCode})`}
                        </span>

                        <span className="text-sm font-medium">
                          -${order.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-black/50">Payment</span>

                      <span className="text-sm font-medium">
                        {copy.payment}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-black/50">
                        Delivering to
                      </span>

                      <span className="text-right text-sm font-medium">
                        {order.shippingAddress.city}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Link
                      to="/orders"
                      className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/85"
                    >
                      View My Orders
                    </Link>

                    <Link
                      to="/"
                      className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium hover:bg-black/5"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
