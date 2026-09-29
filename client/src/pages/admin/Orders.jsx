import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, PackageSearch } from "lucide-react";
import { getAllOrdersAPI } from "@/api/admin.api";
import Pagination from "@/components/Pagination";

const STATUS_OPTIONS = [
  "",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLES = {
  pending: "bg-brand-yellow/20 text-yellow-700",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-brand-pink text-brand-red",
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getAllOrdersAPI({ page, limit: 10, status: statusFilter })
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load orders."),
      )
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-black/50">
            View and manage customer orders.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status
                ? status[0].toUpperCase() + status.slice(1)
                : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-black/50">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <PackageSearch size={28} className="text-black/20" />
            <p className="text-sm text-black/50">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-black/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-3 font-medium">
                      #{order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-black/40">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      {order.items.length}
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      ${order.totalAmount}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          title="View order"
                          className="text-black/50 hover:text-black"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
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
