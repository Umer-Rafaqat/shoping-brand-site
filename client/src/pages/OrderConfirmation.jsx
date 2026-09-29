import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMyOrderByIdAPI } from "@/api/order.api";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrderByIdAPI(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

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
            <p className="text-sm text-black/50">Order not found.</p>
            <Link to="/" className="mt-4 text-sm font-medium underline">
              Back to home
            </Link>
          </>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </span>
            <h1 className="mt-6 font-integral text-2xl font-bold uppercase sm:text-3xl">
              Order Placed!
            </h1>
            <p className="mt-2 max-w-md text-sm text-black/60">
              Thanks for your order — we'll get it ready for delivery. Pay your
              rider cash when it arrives.
            </p>

            <div className="mt-8 w-full max-w-md rounded-2xl border border-black/10 p-6 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50">Order Number</span>
                <span className="text-sm font-bold">#{order.orderNumber}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-black/50">Total Amount</span>
                <span className="text-sm font-bold">${order.totalAmount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-black/50">Payment</span>
                <span className="text-sm font-medium">Cash on Delivery</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-black/50">Delivering to</span>
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
        )}
      </div>

      <Footer />
    </div>
  );
}
