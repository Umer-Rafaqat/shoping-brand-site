import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  createProductAPI,
  updateProductAPI,
  getCategoriesAPI,
  createCategoryAPI,
} from "@/api/products.api";

const toCSV = (arr) => (arr || []).join(", ");
const fromCSV = (str) =>
  str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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

const emptyForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  stock: "",
  images: "",
  sizes: [],
  colors: [],
};

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEditing = Boolean(product);

  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          oldPrice: product.oldPrice ? String(product.oldPrice) : "",
          category: product.category?._id || "",
          stock: String(product.stock),
          images: toCSV(product.images),
          sizes: product.sizes || [],
          colors: product.colors || [],
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    getCategoriesAPI()
      .then(setCategories)
      .finally(() => setLoadingCategories(false));
  }, []);

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
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

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
      const saved = isEditing
        ? await updateProductAPI(product._id, payload)
        : await createProductAPI(payload);
      onSaved(saved);
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
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
      errors[field] ? "border-red-400" : "border-black/15"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Product name"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Description"
              rows={3}
              className={inputClass("description")}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange("price")}
                placeholder="Price ($)"
                className={inputClass("price")}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={handleChange("oldPrice")}
                placeholder="Old price (optional)"
                className={inputClass("oldPrice")}
              />
              {errors.oldPrice && (
                <p className="mt-1 text-xs text-red-500">{errors.oldPrice}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
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
              <button
                type="button"
                onClick={() => setNewCategoryOpen((v) => !v)}
                title="Add new category"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/15 hover:bg-black/5"
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}

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
          </div>

          <div>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange("stock")}
              placeholder="Stock quantity"
              className={inputClass("stock")}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Product images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
              className="mt-2 block w-full text-sm"
            />
            <p className="mt-1 text-xs text-black/40">
              Upload up to 5 images. {isEditing && !imageFiles.length
                ? "Existing images will be kept until you choose new files."
                : "The first image becomes the main product image."}
            </p>
          </div>

          <OptionSelector
            label="Sizes"
            options={SIZE_OPTIONS}
            selected={form.sizes}
            onToggle={(size) => toggleOption("sizes", size)}
          />
          <OptionSelector
            label="Colors"
            options={COLOR_OPTIONS}
            selected={form.colors}
            onToggle={(color) => toggleOption("colors", color)}
          />

          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OptionSelector({ label, options, selected, onToggle }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
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
    </div>
  );
}
