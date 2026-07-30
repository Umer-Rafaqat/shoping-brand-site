import { X } from "lucide-react";

// Figma: width 1440 / height 38 -> full-width bar, height driven by
// vertical padding so it stays correct at any viewport width.
export default function AnnouncementBar() {
  return (
    <div className="relative w-full bg-black py-2.5 text-center">
      <p className="px-10 font-satoshi text-xs text-white">
        Sign up and get 20% off to your first order.{" "}
        <a href="#" className="underline underline-offset-2">
          Sign Up Now
        </a>
      </p>
      <button
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
