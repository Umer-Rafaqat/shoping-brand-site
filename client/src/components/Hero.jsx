import bigStar from "../assets/big-star.png";
import smallStar from "../assets/small-star.png";
import { Button } from "@/components/ui/button";
import heroImg from "../assets/heroImg.jpg";

const stats = [
  { value: "200+", label: "International Brands" },
  { value: "2,000+", label: "High-Quality Products" },
  { value: "30,000+", label: "Happy Customers" },
];

export default function Hero() {
  return (
    <section className="w-full bg-surface-200 ">
      <div className="mx-auto grid w-full max-w-container grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-0 lg:py-0">
        {/* Left: copy */}
        <div className="py-12">
          <h1
            className="font-integral font-bold uppercase leading-[1] tracking-tight text-black"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Find Clothes That Matches Your Style
          </h1>

          <p className="mt-6 max-w-[35rem] font-satoshi text-base leading-[22px] text-black/60">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <Button className="mt-8 w-full sm:w-auto">Shop Now</Button>

          <div className="mt-10">
            {/* Mobile */}
            <div className="flex flex-wrap justify-center lg:hidden">
              {stats.map((s, index) => (
                <div
                  key={s.label}
                  className={`
          ${index === 2 ? "mt-6 w-full text-center" : "w-1/2 text-center"}
          ${index === 0 ? "border-r border-black/10" : ""}
        `}
                >
                  <p className="font-satoshi text-[32px] font-bold leading-none">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-black/60">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex lg:items-center">
              {stats.map((s, index) => (
                <div
                  key={s.label}
                  className={`
        flex-1
        px-8
        ${index !== stats.length - 1 ? "border-r border-black/10" : ""}
      `}
                >
                  <p className="font-satoshi text-[40px] font-bold leading-none">
                    {s.value}
                  </p>

                  <p className="mt-1 text-sm text-black/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="relative flex h-[280px] w-full overflow-hidden rounded-2xl bg-surface-100 sm:h-[420px] lg:h-[620px] ">
          <img
            src={heroImg}
            alt="Fashion collection hero"
            className="h-[160%] w-full object-cover object-bottom"
          />
          <img
            src={bigStar}
            alt=""
            className="absolute right-[8%] top-[8%] w-14 h-14 pointer-events-none"
          />

          <img
            src={smallStar}
            alt=""
            className="absolute left-[6%] top-[45%] w-8 h-8 pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
