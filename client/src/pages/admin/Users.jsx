import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getUsersAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from "@/api/admin.api";
import Pagination from "@/components/Pagination";

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;

export default function Users() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // what's typed, updates every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(""); // what's actually searched
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);

  const fetchUsers = async (pageArg, searchArg) => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersAPI({
        page: pageArg,
        limit: PAGE_SIZE,
        search: searchArg,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce: wait for a pause in typing before it counts as a real search.
  // This is what makes it "live" without needing Enter or a submit button —
  // every keystroke resets the timer, so a fetch only fires once the user
  // stops typing for SEARCH_DEBOUNCE_MS.
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  // A new search term should always jump back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // The actual fetch — runs whenever the page or the debounced search term
  // changes (and once on mount, since both start at their initial values).
  useEffect(() => {
    fetchUsers(page, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const handleDelete = async (target) => {
    if (!confirm(`Delete ${target.name}'s account? This can't be undone.`))
      return;
    try {
      await deleteUserAPI(target._id);
      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        fetchUsers(page, debouncedSearch);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleUserUpdated = (updated) => {
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    setEditingUser(null);
  };

  const handleUserCreated = () => {
    setAddingUser(false);
    fetchUsers(page, debouncedSearch);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="mt-1 text-sm text-black/50">
            You can add, edit, or delete regular users. Admin accounts aren't
            manageable from this panel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddingUser(true)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/85"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="mt-4 flex max-w-sm items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5">
        <Search size={16} className="text-black/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-black/50">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-500">{error}</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-black/50">No users found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/50">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.role?.name === "admin";
                return (
                  <tr
                    key={u._id}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-black/60">{u.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          isAdmin
                            ? "bg-black text-white"
                            : "bg-black/5 text-black/60"
                        }`}
                      >
                        {u.role?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusToggle />
                    </td>
                    <td className="px-5 py-3 text-black/50">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      {isAdmin ? (
                        <span className="block text-right text-xs text-black/30">
                          Not manageable
                        </span>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            title="Edit user"
                            className="text-black/50 hover:text-black"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            title="Delete user"
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {addingUser && (
        <AddUserModal
          onClose={() => setAddingUser(false)}
          onCreated={handleUserCreated}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}

// ─── Active/Inactive toggle ─────────────────────────────────────────────────────
// UI only for now — purely local state, no API call, nothing persisted.
// Wire this up to a real "isActive" field/endpoint whenever that's ready.
function StatusToggle() {
  const [active, setActive] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setActive((v) => !v)}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? "bg-green-100 text-green-700" : "bg-black/5 text-black/40"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}

// ─── Add User modal ────────────────────────────────────────────────────────────
function AddUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await createUserAPI(form);
      onCreated();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setErrors({ form: data?.message || "Failed to create user." });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add User</h2>
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
              placeholder="Full name"
              className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none ${
                errors.name ? "border-red-400" : "border-black/15"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="Email address"
              className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none ${
                errors.email ? "border-red-400" : "border-black/15"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Password (min 8 characters)"
              className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none ${
                errors.password ? "border-red-400" : "border-black/15"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create User"}
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

// ─── Edit User modal (name/email only — no role field, ever) ──────────────────
function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await updateUserAPI(user._id, form);
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit User</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className="w-full rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email address"
            className="w-full rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
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
