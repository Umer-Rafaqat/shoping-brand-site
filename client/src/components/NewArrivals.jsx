import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getPublicProductsAPI } from "@/api/publicProducts.api";

const mapProduct = (p) => ({
  id: p._id,
  name: p.name,
  image: p.images?.[0] || "",
  rating: p.rating || 0,
  price: p.price,
  oldPrice: p.oldPrice,
  discount: p.discountPercent ? `-${p.discountPercent}%` : null,
});

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProductsAPI({ page: 1, limit: 4, sort: "newest" })
      .then((data) => setProducts(data.products.map(mapProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-container px-[4%] py-12 md:py-16">
        <h2 className="text-center font-integral text-3xl font-bold uppercase sm:text-4xl">
          New Arrivals
        </h2>

        {loading ? (
          <p className="mt-10 text-center font-satoshi text-sm text-black/50">
            Loading...
          </p>
        ) : products.length === 0 ? (
          <p className="mt-10 text-center font-satoshi text-sm text-black/50">
            No products yet — add some from the admin panel.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center border-b border-black/10 pb-10">
          <Button variant="outline" className="px-12">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}
