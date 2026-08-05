import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { topSelling } from "@/data/products";

export default function TopSelling() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-container px-[4%] py-12 md:py-16">
        <h2 className="text-center font-integral text-3xl font-bold uppercase sm:text-4xl">
          Top Selling
        </h2>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 hide-scrollbar lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
          {topSelling.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0 lg:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="px-12">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}
