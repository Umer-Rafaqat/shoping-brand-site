import { Button } from "@/components/ui/button";

// Figma: width 1240 / height 180, centered (left 100 in a 1440 canvas)
// -> full-width container with the same horizontal padding as the rest
// of the page, so it stays centered and responsive at any breakpoint.
export default function Newsletter() {
  return (
    <div className="relative z-20 mx-auto w-full max-w-container px-[4%]">
      <div className="flex w-full flex-col items-center justify-between gap-6 rounded-[20px] bg-black px-6 py-9 sm:flex-row sm:px-16">
        <h3 className="max-w-[551px] text-center font-integral text-[32px] font-bold uppercase leading-[36px] text-white sm:text-left lg:text-[40px] lg:leading-[45px]">
  Stay Upto Date About Our Latest Offers
</h3>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full rounded-full bg-white px-5 py-3 font-satoshi text-sm outline-none placeholder:text-black/40"
          />
          <Button className="w-full bg-white text-black hover:bg-white/90">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </div>
  );
}
