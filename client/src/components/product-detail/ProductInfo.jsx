import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductInfo({ product }) {
  const {
    id,
    name,
    rating,
    price,
    oldPrice,
    discount,
    description,
    colors,
    sizes,
    stock,
  } = product;

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const outOfStock = stock === 0;

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setAdding(true);
    try {
      await addToCart({
        productId: id,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add to cart.");
    } finally {
      setAdding(false);
    }
  };

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

      {colors.length > 0 && (
        <>
          <div className="my-6 border-t border-black/10" />
          <div>
            <p className="font-satoshi text-sm text-black/60">Select Colors</p>
            <div className="mt-3 flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  onClick={() => setSelectedColor(color)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                  style={{ backgroundColor: color.toLowerCase() }}
                >
                  {selectedColor === color && (
                    <Check
                      size={16}
                      className={
                        color.toLowerCase() === "white"
                          ? "text-black"
                          : "text-white"
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {sizes.length > 0 && (
        <>
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
        </>
      )}

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

          <span className="font-satoshi text-base font-medium">{quantity}</span>

          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock || q + 1, q + 1))}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || outOfStock}
          className="flex-1 h-14 rounded-full bg-black font-satoshi text-base font-medium text-white transition-colors hover:bg-black/85 disabled:opacity-50"
        >
          {outOfStock
            ? "Out of Stock"
            : adding
              ? "Adding..."
              : added
                ? "Added ✓"
                : "Add to Cart"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
