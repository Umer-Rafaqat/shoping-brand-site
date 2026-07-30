import { useState } from "react";
import { Star, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductInfo({ product }) {
  const { name, rating, price, oldPrice, discount, description, colors, sizes } = product;

  const [selectedColor, setSelectedColor] = useState(colors[0]?.id);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="lg:w-[530px]">
      <h1 className="font-integral text-2xl font-bold uppercase leading-tight sm:text-3xl">
        {name}
      </h1>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(rating)
                  ? "fill-brand-yellow text-brand-yellow"
                  : "fill-black/10 text-black/10"
              }
            />
          ))}
        </div>
        <span className="font-satoshi text-sm text-black/60">{rating}/5</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-satoshi text-3xl font-bold">${price}</span>
        {oldPrice && (
          <span className="font-satoshi text-2xl text-black/30 line-through">
            ${oldPrice}
          </span>
        )}
        {discount && <Badge variant="discount">{discount}</Badge>}
      </div>

      <p className="mt-4 font-satoshi text-sm leading-relaxed text-black/60">
        {description}
      </p>

      <div className="my-6 border-t border-black/10" />

      <div>
        <p className="font-satoshi text-sm text-black/60">Select Colors</p>
        <div className="mt-3 flex gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-label={color.id}
              onClick={() => setSelectedColor(color.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: color.value }}
            >
              {selectedColor === color.id && (
                <Check size={16} className="text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 border-t border-black/10" />

      <div>
        <p className="font-satoshi text-sm text-black/60">Choose Size</p>
       <div className="mt-3 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-3">
  {sizes.map((size) => (
    <button
      key={size}
      type="button"
      onClick={() => setSelectedSize(size)}
      className={`h-12 rounded-full px-5 font-satoshi text-sm transition-colors ${
        selectedSize === size
          ? "bg-black text-white"
          : "bg-surface-100 text-black/70 hover:bg-surface-100/70"
      }`}
    >
      {size}
    </button>
  ))}
</div>
      </div>

      <div className="my-6 border-t border-black/10" />

     <div className="mt-6 flex items-center gap-5">
  {/* Quantity */}
  <div className="flex h-14 w-[170px] items-center justify-between rounded-full bg-surface-100 px-6">
    <button
      type="button"
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    >
      <Minus size={20} />
    </button>

    <span className="font-satoshi text-base font-medium">
      {quantity}
    </span>

    <button
      type="button"
      onClick={() => setQuantity((q) => q + 1)}
    >
      <Plus size={20} />
    </button>
  </div>

  {/* Add to Cart */}
  <button
    type="button"
    className="flex-1 h-14 rounded-full bg-black font-satoshi text-base font-medium text-white transition-colors hover:bg-black/85"
  >
    Add to Cart
  </button>
</div>
    </div>
  );
}
