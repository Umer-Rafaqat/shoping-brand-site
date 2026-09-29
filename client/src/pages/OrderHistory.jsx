import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PackageSearch, CheckCircle2 } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product-detail/Breadcrumb";
import Pagination from "@/components/Pagination";
import { getMyOrdersAPI, cancelMyOrderAPI } from "@/api/order.api";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

const STATUS_STYLES = {
  pending: "bg-brand-yellow/20 text-yellow-700",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-brand-pink text-brand-red",
};

export default function OrderHistory() {
  const location = useLocation();
  const justPlacedOrderNumber = location.state?.justPlacedOrderNumber;

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    getMyOrdersAPI({ page, limit: 10 })
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [page]);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelMyOrderAPI(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't cancel this order.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb items={["Home", "My Orders"]} />

        <h1 className="mb-8 font-integral text-3xl font-bold uppercase sm:text-4xl">
          My Orders
        </h1>

        {justPlacedOrderNumber && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-700">
            <CheckCircle2 size={20} className="shrink-0" />
            <p className="text-sm font-medium">
              Order #{justPlacedOrderNumber} placed successfully! We'll get it
              ready for delivery.
            </p>
          </div>
        )}

        {loading ? (
          <p className="mb-16 text-center text-sm text-black/50">
            Loading your orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="mb-16 flex flex-col items-center gap-3 rounded-2xl border border-black/10 py-20 text-center">
            <PackageSearch size={28} className="text-black/20" />
            <p className="font-satoshi text-base text-black/60">
              You haven't placed any orders yet.
            </p>
            <Link
              to="/"
              className="mt-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mb-8 flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order #{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-black/40">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="my-4 border-t border-black/10" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-black/60">
                    {order.items.length} item
                    {order.items.length > 1 ? "s" : ""} · ${order.totalAmount}
                  </p>
                  {order.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                      className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      {cancellingId === order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <Footer />
    </div>
  );
}
