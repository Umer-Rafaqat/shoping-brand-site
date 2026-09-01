import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ImageOff,
  Pencil,
  Tag,
  Boxes,
  DollarSign,
} from "lucide-react";
import { getProductByIdAPI } from "@/api/products.api";
import { assetUrl } from "@/lib/assetUrl";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    getProductByIdAPI(id)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load product."),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-sm text-black/50">Loading...</p>;
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>;
  if (!product) return null;

  const stock = {
    label:
      product.stock === 0
        ? "Out of stock"
        : product.stock < 10
          ? "Low stock"
          : "In stock",
    classes:
      product.stock === 0
        ? "bg-brand-pink text-brand-red"
        : product.stock < 10
          ? "bg-brand-yellow/20 text-yellow-700"
          : "bg-emerald-50 text-emerald-700",
  };

  const images = product.images?.length ? product.images : [null];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-1.5 text-sm text-black/60 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <Link
          to={`/admin/products/${product._id}/edit`}
          className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/85"
        >
          <Pencil size={16} />
          Edit Product
        </Link>
      </div>

      {/* Stat strip */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={DollarSign}
          label="Price"
          value={
            <span className="flex items-baseline gap-2">
              ${product.price}
              {product.oldPrice > product.price && (
                <span className="text-sm font-normal text-black/40 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </span>
          }
        />
        <StatCard
          icon={Boxes}
          label="Stock"
          value={product.stock}
          badge={stock}
        />
        <StatCard
          icon={Tag}
          label="Category"
          value={product.category?.name || "—"}
        />
      </div>

      {/* Main content */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Gallery */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 lg:col-span-2">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface-100">
            {images[activeImage] ? (
              <img
                src={assetUrl(images[activeImage])}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff size={32} className="text-black/20" />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i
                      ? "border-black"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {img ? (
                    <img
                      src={assetUrl(img)}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-100">
                      <ImageOff size={14} className="text-black/20" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-black/40">
              {product.category?.name || "Uncategorized"}
            </p>
            <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-black/60">
                {product.description}
              </p>
            )}
          </div>

          {(product.sizes?.length > 0 || product.colors?.length > 0) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.sizes?.length > 0 && (
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <p className="text-sm font-medium">Available Sizes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <p className="text-sm font-medium">Available Colors</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, badge }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
          <Icon size={18} />
        </div>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.classes}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm text-black/50">{label}</p>
    </div>
  );
}
