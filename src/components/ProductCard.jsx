import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }) {
  const { id, name, image, rating, price, oldPrice, discount } = product;

  return (
    <Link to={`/product/${id}`} className="block">
      <Card className="w-full">
        <CardContent>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-100">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="mt-4">
            <h3 className="mt-4 font-satoshi text-[20px] font-bold leading-none tracking-normal text-black">
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(rating)
                      ? "fill-brand-yellow text-brand-yellow"
                      : "fill-black/10 text-black/10"
                  }
                />
              ))}
              <span className="ml-1 font-satoshi text-xs text-black/60">
                {rating}/5
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-satoshi text-lg font-bold">${price}</span>
              {oldPrice && (
                <span className="font-satoshi text-sm text-black/40 line-through">
                  ${oldPrice}
                </span>
              )}
              {discount && <Badge variant="discount">{discount}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
