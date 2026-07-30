import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full overflow-visible py-16">
     <div className="mx-auto max-w-[1440px] overflow-visible px-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <h2 className="font-integral text-4xl font-bold uppercase">
            Our Happy Customers
          </h2>

          <div className="flex gap-3">

            <button
              onClick={scrollPrev}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={scrollNext}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <ChevronRight size={28} />
            </button>

          </div>

        </div>

        {/* Carousel */}

        <div
          ref={emblaRef}
          className="overflow-visible mt-10"
        >
          <div className="flex">

            {testimonials.map((item, index) => {

              const total = testimonials.length;

const center = selectedIndex;

const left = (center - 1 + total) % total;
const right = (center + 1) % total;

const isVisible = [left, center, right].includes(index);

              return (

                <div
                  key={item.id}
                 className={`
  flex-[0_0_85%]
  sm:flex-[0_0_50%]
  lg:flex-[0_0_33.333%]
  px-4
  transition-all
  duration-500
  ${
    isVisible
      ? "opacity-100 scale-100 blur-0"
      : "opacity-30 scale-95 blur-sm"
  }
`}
                >

                  <div className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-sm">

                    <div className="flex gap-1">

                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}

                    </div>

                    <div className="mt-5 flex items-center gap-2">

                      <h3 className="text-xl font-bold">
                        {item.name}
                      </h3>

                      {item.verified && (
                        <BadgeCheck
                          size={20}
                          className="fill-green-500 text-white"
                        />
                      )}

                    </div>

                    <p className="mt-5 leading-8 text-gray-500">
                      "{item.quote}"
                    </p>

                  </div>

                </div>

              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}
