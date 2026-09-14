import { useEffect, useState } from "react";
import { ShoppingCart, ImageOff } from "lucide-react";
import { getCartActivityAPI } from "@/api/admin.api";
import { assetUrl } from "@/lib/assetUrl";
import Pagination from "@/components/Pagination";

export default function CartActivity() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getCartActivityAPI({ page, limit: 10 })
      .then((data) => {
        setRows(data.rows);
        setTotalPages(data.totalPages);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load cart activity.",
        ),
      )
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cart Activity</h1>
          <p className="mt-1 text-sm text-black/50">
            See which users have added products to their cart.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-black/50">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-500">{error}</p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShoppingCart size={28} className="text-black/20" />
            <p className="text-sm text-black/50">
              No cart activity yet — nothing's been added to any cart.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-black/40">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Color</th>
                  <th className="px-5 py-3 font-medium">Quantity</th>
                  <th className="px-5 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {rows.map((row) => (
                  <tr key={row.cartItemId}>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.user.name}</p>
                      <p className="text-xs text-black/40">{row.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5">
                          {row.product.image ? (
                            <img
                              src={assetUrl(row.product.image)}
                              alt={row.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff size={14} className="text-black/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{row.product.name}</p>
                          <p className="text-xs text-black/40">
                            ${row.product.price}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      {row.size || "—"}
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      {row.color || "—"}
                    </td>
                    <td className="px-5 py-3 text-black/60">{row.quantity}</td>
                    <td className="px-5 py-3 text-black/60">
                      {new Date(row.addedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
