import ProductCard from "@/components/ProductCard";
import { relatedProducts } from "@/data/products";

export default function RelatedProducts() {
  return (
    <div className="mt-16">
      <h2 className="text-center font-integral text-3xl font-bold uppercase sm:text-4xl">
        You Might Also Like
      </h2>

      <div className="mt-10 flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-4">
        {relatedProducts.map((p) => (
          <div key={p.id} className="w-[220px] shrink-0 sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
