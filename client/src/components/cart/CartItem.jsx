import { Trash2, Minus, Plus, ImageOff } from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";

export default function CartItem({ item, onQuantityChange, onRemove }) {
  const { id, name, image, price, size, color, quantity } = item;

  return (
    <div className="flex gap-4 py-4 first:pt-7">
      <div className="flex h-[7rem] w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-100 sm:h-28 sm:w-28">
        {image ? (
          <img
            src={assetUrl(image)}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff size={24} className="text-black/20" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-satoshi text-base font-bold text-black sm:text-lg">
              {name}
            </h3>
            <p className="mt-1 font-satoshi text-sm text-black/50">
              Size: <span className="text-black/70">{size}</span>
            </p>
            <p className="font-satoshi text-sm text-black/50">
              Color: <span className="text-black/70">{color}</span>
            </p>
          </div>

          <button
            type="button"
            aria-label={`Remove ${name} from cart`}
            onClick={() => onRemove(id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-satoshi text-lg font-bold">${price}</span>

          <div className="flex items-center gap-4 rounded-full bg-surface-100 px-4 py-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="w-4 text-center font-satoshi text-sm">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange(id, quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
