const STYLES = {
  COD: "bg-black/5 text-black/60",
  paid: "bg-emerald-50 text-emerald-700",
  refunded: "bg-violet-50 text-violet-700",
  unpaid: "bg-brand-yellow/20 text-yellow-700",
  failed: "bg-brand-pink text-brand-red",
};

export default function PaymentBadge({ order }) {
  const key = order.paymentMethod === "STRIPE" ? order.paymentStatus : "COD";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STYLES[key]}`}
    >
      {key}
    </span>
  );
}
