import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ImageOff } from "lucide-react";
import {
  createProductAPI,
  getCategoriesAPI,
  createCategoryAPI,
} from "@/api/products.api";

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
  sizes: [],
  colors: [],
};

export default function ProductCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
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
    payload.append("images", JSON.stringify([]));
    payload.append("sizes", JSON.stringify(form.sizes));
    payload.append("colors", JSON.stringify(form.colors));
    imageFiles.forEach((file) => payload.append("images", file));

    try {
      const saved = await createProductAPI(payload);
      navigate(`/admin/products/${saved._id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setErrors({ form: data?.message || "Failed to create product." });
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-black/40 ${
      errors[field] ? "border-red-400" : "border-black/15"
    }`;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-1.5 text-sm text-black/60 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="mt-1 text-sm text-black/50">
          Fill in the details below to list a new product.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Section title="Basic Information">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/50">
                Product name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g. Oversized Cotton Hoodie"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-black/50">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={handleChange("description")}
                placeholder="What makes this product worth buying?"
                rows={4}
                className={inputClass("description")}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
          </Section>

          <Section title="Pricing & Inventory">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange("price")}
                  placeholder="0.00"
                  className={inputClass("price")}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Old price
                </label>
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
                  <p className="mt-1 text-xs text-red-500">{errors.oldPrice}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-black/50">
                  Stock quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange("stock")}
                  placeholder="0"
                  className={inputClass("stock")}
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>
          </Section>

          <Section title="Variants">
            <OptionSelector
              label="Sizes"
              options={SIZE_OPTIONS}
              selected={form.sizes}
              onToggle={(size) => toggleOption("sizes", size)}
            />
            <div className="mt-4">
              <OptionSelector
                label="Colors"
                options={COLOR_OPTIONS}
                selected={form.colors}
                onToggle={(color) => toggleOption("colors", color)}
              />
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-4">
          <Section title="Category">
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
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-black/15 hover:bg-black/5"
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
          </Section>

          <Section title="Images">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 px-4 py-6 text-center hover:bg-black/[0.02]">
              <ImageOff size={18} className="text-black/30" />
              <span className="text-xs font-medium">
                {imageFiles.length > 0
                  ? `${imageFiles.length} file(s) selected`
                  : "Click to upload images"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  setImageFiles(Array.from(event.target.files || []))
                }
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-black/40">
              Upload up to 5 images. The first image becomes the main product
              image.
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
              className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
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

function OptionSelector({ label, options, selected, onToggle }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-black/50">{label}</p>
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
