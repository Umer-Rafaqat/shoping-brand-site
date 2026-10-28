import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ImageOff, Package, DollarSign, User } from "lucide-react";
import { getOrderByIdAdminAPI, updateOrderStatusAPI } from "@/api/admin.api";
import { assetUrl } from "@/lib/assetUrl";
import PaymentBadge from "@/components/PaymentBadge";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLES = {
  pending: "bg-brand-yellow/20 text-yellow-700",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-brand-pink text-brand-red",
};

export default function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrder = () => {
    setLoading(true);
    setError("");

    getOrderByIdAdminAPI(id)
      .then(setOrder)
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load order."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrder, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (
      newStatus === "cancelled" &&
      order.paymentMethod === "STRIPE" &&
      order.paymentStatus === "paid" &&
      !window.confirm(
        "Cancel this order and refund the amount charged to the customer's card?",
      )
    ) {
      return;
    }

    setUpdating(true);

    try {
      const updated = await updateOrderStatusAPI(id, newStatus);
      setOrder(updated);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-black/50">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-red-500">{error}</p>;
  }

  if (!order) return null;

  const locked =
    order.status === "cancelled" ||
    (order.paymentMethod === "STRIPE" &&
      !["paid", "refunded"].includes(order.paymentStatus));

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="flex items-center gap-1.5 text-sm text-black/60 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>

          <p className="mt-1 text-sm text-black/50">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
          >
            {order.status}
          </span>

          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating || locked}
            className="rounded-xl border border-black/15 px-3 py-2 text-sm outline-none disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                Set to: {status[0].toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat strip */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <DollarSign size={18} />
          </div>

          <p className="mt-4 text-2xl font-bold">${order.totalAmount}</p>

          <p className="text-sm text-black/50">Total Amount</p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <Package size={18} />
          </div>

          <p className="mt-4 text-2xl font-bold">{order.items.length}</p>

          <p className="text-sm text-black/50">Items</p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <User size={18} />
          </div>

          <p className="mt-4 truncate text-base font-bold">
            {order.user?.name}
          </p>

          <p className="truncate text-sm text-black/50">{order.user?.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Items */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold">Items</p>

          <div className="flex flex-col divide-y divide-black/5">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-100">
                  {item.image ? (
                    <img
                      src={assetUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff size={18} className="text-black/20" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  <p className="text-xs text-black/40">
                    {[item.size, item.color].filter(Boolean).join(" · ") || "—"}{" "}
                    · Qty {item.quantity}
                  </p>
                </div>

                <p className="font-medium">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-black/10 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-black/50">Subtotal</span>
              <span>${order.subtotal}</span>
            </div>

            <div className="mt-1.5 flex justify-between text-sm">
              <span className="text-black/50">Delivery Fee</span>
              <span>${order.deliveryFee}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="mt-1.5 flex justify-between text-sm text-emerald-700">
                <span>
                  Discount
                  {order.couponCode && ` (${order.couponCode})`}
                </span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="mt-2.5 flex justify-between border-t border-black/10 pt-2.5 text-base font-bold">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="mb-4 text-sm font-semibold">Shipping Address</p>

          <div className="flex flex-col gap-1.5 text-sm text-black/70">
            <p className="font-medium text-black">
              {order.shippingAddress.fullName}
            </p>

            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine}</p>

            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>

          <div className="mt-5 border-t border-black/10 pt-4">
            <p className="text-xs text-black/40">Payment</p>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-sm font-medium">
                {order.paymentMethod === "STRIPE"
                  ? "Card (Stripe)"
                  : "Cash on Delivery"}
              </span>

              <PaymentBadge order={order} />
            </div>

            {order.paidAt && (
              <p className="mt-1.5 text-xs text-black/40">
                Paid on {new Date(order.paidAt).toLocaleString()}
              </p>
            )}

            {order.stripePaymentIntentId && (
              <p className="mt-1 break-all text-xs text-black/40">
                Stripe ref: {order.stripePaymentIntentId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
