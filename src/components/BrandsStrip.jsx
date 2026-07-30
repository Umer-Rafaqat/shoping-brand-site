import versaceLogo from "../assets/brands/versace.png";
import zaraLogo from "../assets/brands/zara.png";
import gucciLogo from "../assets/brands/gucci.png";
import pradaLogo from "../assets/brands/prada.png";
import calvinKleinLogo from "../assets/brands/calvinklein.png";

// Placeholder logos live in src/assets/brands/*.svg — replace each file
// with the real brand asset (keep the same filename, or update the
// import above) and this section needs no other changes.
const brandLogos = [
  { name: "Versace", src: versaceLogo },
  { name: "Zara", src: zaraLogo },
  { name: "Gucci", src: gucciLogo },
  { name: "Prada", src: pradaLogo },
  { name: "Calvin Klein", src: calvinKleinLogo },
];

// Figma: width 1440 / height 122 -> full-width strip, height driven by
// padding (py-8/py-10) so it scales with content instead of a fixed px value.
export default function BrandsStrip() {
  return (
    <section className="w-full bg-black">
      <div className="mx-auto flex w-full max-w-container flex-wrap items-center justify-between gap-8 px-[4%] py-8 md:py-10">
        {brandLogos.map((brand) => (
          <img
            key={brand.name}
            src={brand.src}
            alt={brand.name}
            className="h-6 w-auto object-contain opacity-90 md:h-8"
          />
        ))}
      </div>
    </section>
  );
}
