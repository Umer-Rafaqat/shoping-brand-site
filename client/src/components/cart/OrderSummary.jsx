import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSummary({ subtotal, deliveryFee }) {
  const navigate = useNavigate();
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <h2 className="font-satoshi text-xl font-bold">Order Summary</h2>

      <div className="mt-6 flex flex-col gap-4 font-satoshi text-sm">
        <div className="flex items-center justify-between">
          <span className="text-black/50">Subtotal</span>
          <span className="font-medium">${subtotal}</span>
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

      <Button
        size="lg"
        onClick={() => navigate("/checkout")}
        className="mt-8 w-full gap-2"
      >
        Go to Checkout
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}
