import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Pencil, Plus, ImageOff, Eye } from "lucide-react";
import {
  getProductsAPI,
  deleteProductAPI,
  getCategoriesAPI,
} from "@/api/products.api";
import Pagination from "@/components/Pagination";
import { assetUrl } from "@/lib/assetUrl";

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;
const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (pageArg, searchArg, categoryArg, sizeArg) => {
    setLoading(true);
    setError("");
    try {
      const data = await getProductsAPI({
        page: pageArg,
        limit: PAGE_SIZE,
        search: searchArg,
        category: categoryArg,
        size: sizeArg,
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoriesAPI()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, sizeFilter]);

  useEffect(() => {
    fetchProducts(page, debouncedSearch, categoryFilter, sizeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, categoryFilter, sizeFilter]);

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await deleteProductAPI(product._id);
      if (products.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        fetchProducts(page, debouncedSearch, categoryFilter, sizeFilter);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-black/50">
            Add new products, or edit and remove existing ones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products/new")}
          className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/85"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex max-w-sm flex-1 items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5">
          <Search size={16} className="text-black/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name"
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option value="">All sizes</option>
          {SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-black/50">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-black/50">No products found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/60">
              <tr>
                <th className="px-5 py-3 font-black ">Product</th>
                <th className="px-5 py-3 font-black">Category</th>
                <th className="px-5 py-3 font-black">Price</th>
                <th className="px-5 py-3 font-black">Stock</th>
                <th className="px-5 py-3 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5">
                        {p.images?.[0] ? (
                          <img
                            src={assetUrl(p.images[0])}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff size={16} className="text-black/30" />
                        )}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black/60">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-medium">${p.price}</span>
                    {p.oldPrice > p.price && (
                      <span className="ml-2 text-xs text-black/40 line-through">
                        ${p.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        p.stock === 0
                          ? "text-red-500"
                          : p.stock < 10
                            ? "text-yellow-600"
                            : "text-black/60"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/products/${p._id}`)}
                        title="View product"
                        className="text-black/50 hover:text-black"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/products/${p._id}/edit`)
                        }
                        title="Edit product"
                        className="text-black/50 hover:text-black"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        title="Delete product"
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
