import { useState } from "react";
import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSummary({
  subtotal,
  discountPercent,
  deliveryFee,
  onApplyPromo,
}) {
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount + deliveryFee;

  const handleApply = () => {
    if (!promoCode.trim()) return;
    const success = onApplyPromo(promoCode.trim());
    setPromoMessage(
      success
        ? { type: "success", text: "Promo code applied!" }
        : { type: "error", text: "Invalid promo code." },
    );
  };

  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <h2 className="font-satoshi text-xl font-bold">Order Summary</h2>

      <div className="mt-6 flex flex-col gap-4 font-satoshi text-sm">
        <div className="flex items-center justify-between">
          <span className="text-black/50">Subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/50">Discount (-{discountPercent}%)</span>
          <span className="font-medium text-red-500">-${discountAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/50">Delivery Fee</span>
          <span className="font-medium">${deliveryFee}</span>
        </div>
      </div>

      <div className="my-6 border-t border-black/10" />

      <div className="flex items-center justify-between">
        <span className="font-satoshi text-base">Total</span>
        <span className="font-satoshi text-xl font-bold">${total}</span>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-surface-100 px-4 py-3">
          <Tag size={16} className="shrink-0 text-black/40" />
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Add promo code"
            className="w-full bg-transparent font-satoshi text-sm outline-none placeholder:text-black/40"
          />
        </div>
        <Button onClick={handleApply} className="sm:px-8">
          Apply
        </Button>
      </div>

      {promoMessage && (
        <p
          className={`mt-2 font-satoshi text-xs ${
            promoMessage.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {promoMessage.text}
        </p>
      )}

      <Button size="lg" className="mt-5 w-full gap-2">
        Go to Checkout
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}
