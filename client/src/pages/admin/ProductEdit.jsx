import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ImagePlus, X, Loader2 } from "lucide-react";
import {
  getProductByIdAPI,
  updateProductAPI,
  getCategoriesAPI,
  createCategoryAPI,
} from "@/api/products.api";
import { assetUrl } from "@/lib/assetUrl";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
  "Gray",
];
const MAX_IMAGES = 5;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  stock: "",
  sizes: [],
  colors: [],
};

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    getCategoriesAPI()
      .then(setCategories)
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    getProductByIdAPI(id)
      .then((p) => {
        setProduct(p);
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          oldPrice: p.oldPrice ? String(p.oldPrice) : "",
          category: p.category?._id || "",
          stock: String(p.stock),
          sizes: p.sizes || [],
          colors: p.colors || [],
        });
      })
      .catch((err) =>
        setLoadError(err.response?.data?.message || "Failed to load product."),
      )
      .finally(() => setLoading(false));
  }, [id]);

  // Build (and clean up) local preview URLs for any newly-selected files.
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleOption = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAddImages = (event) => {
    const newFiles = Array.from(event.target.files || []);
    setImageFiles((prev) => [...prev, ...newFiles].slice(0, MAX_IMAGES));
    setErrors((prev) => ({ ...prev, images: "" }));
    event.target.value = "";
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const category = await createCategoryAPI(newCategoryName.trim());
      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setForm((prev) => ({ ...prev, category: category._id }));
      setNewCategoryName("");
      setNewCategoryOpen(false);
      setErrors((prev) => ({ ...prev, category: "" }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category.");
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.description.trim())
      nextErrors.description = "Description is required.";
    if (!form.price) nextErrors.price = "Price is required.";
    if (!form.stock) nextErrors.stock = "Stock quantity is required.";
    if (!form.category) nextErrors.category = "Please select a category.";
    if (form.sizes.length === 0) nextErrors.sizes = "Select at least one size.";
    if (form.colors.length === 0)
      nextErrors.colors = "Select at least one color.";
    if (imageFiles.length === 0 && !(product?.images?.length > 0)) {
      nextErrors.images = "Please upload at least one product image.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("description", form.description.trim());
    payload.append("price", form.price);
    if (form.oldPrice) payload.append("oldPrice", form.oldPrice);
    payload.append("category", form.category);
    payload.append("stock", form.stock);
    payload.append("images", JSON.stringify(product?.images || []));
    payload.append("sizes", JSON.stringify(form.sizes));
    payload.append("colors", JSON.stringify(form.colors));
    imageFiles.forEach((file) => payload.append("images", file));

    try {
      await updateProductAPI(product._id, payload);
      navigate(`/admin/products/${product._id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setErrors({ form: data?.message || "Failed to save product." });
      }
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-black/40 ${
      errors[field] ? "border-red-400" : "border-black/15"
    }`;

  if (loading) return <p className="p-6 text-sm text-black/50">Loading...</p>;
  if (loadError) return <p className="p-6 text-sm text-red-500">{loadError}</p>;

  // While the user hasn't picked new files, show the existing images (read-only
  // preview). As soon as they add a new file, we switch to showing the staged
  // new files instead — uploading new images replaces the whole set on save.
  const showingExisting =
    imageFiles.length === 0 && product?.images?.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(`/admin/products/${id}`)}
        className="flex items-center gap-1.5 text-sm text-black/60 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Product
      </button>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="mt-1 text-sm text-black/50">{product?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <fieldset
          disabled={saving}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 disabled:opacity-60"
        >
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Section title="Basic Information">
              <div>
                <Label required>Product name</Label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="e.g. Oversized Cotton Hoodie"
                  className={inputClass("name")}
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </div>

              <div className="mt-3">
                <Label required>Description</Label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="What makes this product worth buying?"
                  rows={4}
                  className={inputClass("description")}
                />
                {errors.description && (
                  <FieldError>{errors.description}</FieldError>
                )}
              </div>
            </Section>

            <Section title="Pricing & Inventory">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <Label required>Price ($)</Label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange("price")}
                    placeholder="0.00"
                    className={inputClass("price")}
                  />
                  {errors.price && <FieldError>{errors.price}</FieldError>}
                </div>
                <div>
                  <Label>Old price</Label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={handleChange("oldPrice")}
                    placeholder="Optional"
                    className={inputClass("oldPrice")}
                  />
                  {errors.oldPrice && (
                    <FieldError>{errors.oldPrice}</FieldError>
                  )}
                </div>
                <div>
                  <Label required>Stock quantity</Label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange("stock")}
                    placeholder="0"
                    className={inputClass("stock")}
                  />
                  {errors.stock && <FieldError>{errors.stock}</FieldError>}
                </div>
              </div>
            </Section>

            <Section title="Variants">
              <OptionSelector
                label="Sizes"
                required
                options={SIZE_OPTIONS}
                selected={form.sizes}
                onToggle={(size) => toggleOption("sizes", size)}
                error={errors.sizes}
              />
              <div className="mt-4">
                <OptionSelector
                  label="Colors"
                  required
                  options={COLOR_OPTIONS}
                  selected={form.colors}
                  onToggle={(color) => toggleOption("colors", color)}
                  error={errors.colors}
                />
              </div>
            </Section>
          </div>

          <div className="flex flex-col gap-4">
            <Section title="Category">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label required>Category</Label>
                  <select
                    value={form.category}
                    onChange={handleChange("category")}
                    disabled={loadingCategories}
                    className={inputClass("category")}
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setNewCategoryOpen((v) => !v)}
                  title="Add new category"
                  className="mt-[22px] flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-black/15 hover:bg-black/5"
                >
                  <Plus size={16} />
                </button>
              </div>
              {errors.category && <FieldError>{errors.category}</FieldError>}

              {newCategoryOpen && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="w-full rounded-xl border border-black/15 px-4 py-2 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="shrink-0 rounded-xl bg-black px-4 py-2 text-sm text-white"
                  >
                    Add
                  </button>
                </div>
              )}
            </Section>

            <Section title="Images">
              <Label required>Product photos</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {showingExisting
                  ? product.images.map((img, index) => (
                      <div
                        key={img}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-surface-100"
                      >
                        <img
                          src={assetUrl(img)}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
                            Main
                          </span>
                        )}
                      </div>
                    ))
                  : imageFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10"
                      >
                        <img
                          src={imagePreviews[index]}
                          alt={`New preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          title="Remove image"
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                        >
                          <X size={12} />
                        </button>
                        {index === 0 && (
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
                            Main
                          </span>
                        )}
                      </div>
                    ))}

                {imageFiles.length < MAX_IMAGES && (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-black/20 text-center hover:bg-black/[0.02]">
                    <ImagePlus size={16} className="text-black/30" />
                    <span className="text-[10px] font-medium text-black/50">
                      Add
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddImages}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {errors.images && <FieldError>{errors.images}</FieldError>}
              {!showingExisting && imageFiles.length > 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  Uploading new images will replace all current images.
                </p>
              )}
              <p className="mt-2 text-xs text-black/40">
                Up to {MAX_IMAGES} images.
              </p>
            </Section>

            {errors.form && (
              <p className="rounded-xl bg-brand-pink px-4 py-2.5 text-xs text-brand-red">
                {errors.form}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/products/${id}`)}
                disabled={saving}
                className="rounded-full border border-black/15 px-5 py-2.5 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="mb-4 text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-black/50">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ children }) {
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

function OptionSelector({
  label,
  options,
  selected,
  onToggle,
  required,
  error,
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-black/50">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={isSelected}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-black/15 text-black/60 hover:border-black/40"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
