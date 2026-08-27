import { X, ImageOff } from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";

export default function ProductViewModal({ product, onClose }) {
  if (!product) return null;

  const stockLabel =
    product.stock === 0
      ? "Out of stock"
      : product.stock < 10
        ? "Low stock"
        : "In stock";

  const stockClass =
    product.stock === 0
      ? "text-red-500"
      : product.stock < 10
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Product Details</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/5">
            {product.images?.[0] ? (
              <img
                src={assetUrl(product.images[0])}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageOff size={24} className="text-black/30" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-black/50">
              {product.category?.name || "—"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-medium">${product.price}</span>
              {product.oldPrice > product.price && (
                <span className="text-xs text-black/40 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {product.images?.length > 1 && (
          <div className="mt-4 flex gap-2">
            {product.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5"
              >
                <img
                  src={assetUrl(img)}
                  alt={`${product.name} ${i + 2}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-black/10 p-4 text-sm">
          <div>
            <p className="text-black/40">Stock</p>
            <p className={`mt-1 font-medium ${stockClass}`}>
              {product.stock}{" "}
              <span className="font-normal">({stockLabel})</span>
            </p>
          </div>
          <div>
            <p className="text-black/40">Category</p>
            <p className="mt-1 font-medium">{product.category?.name || "—"}</p>
          </div>
        </div>

        {product.description && (
          <div className="mt-4">
            <p className="text-sm font-medium">Description</p>
            <p className="mt-1 text-sm text-black/60">{product.description}</p>
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Sizes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-black/15 px-3 py-1 text-xs"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Colors</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-black/15 px-3 py-1 text-xs"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-black/15 py-2.5 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
