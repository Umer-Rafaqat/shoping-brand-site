import { useState } from "react";
import { X } from "lucide-react";
import { updateAdminProfileAPI } from "@/api/auth.api";

export default function AdminProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("username", form.username);
      if (avatarFile) payload.append("avatar", avatarFile);
      const updated = await updateAdminProfileAPI(payload);
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Admin Profile</h2>
            <p className="mt-1 text-xs text-black/50">Email cannot be changed here.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close profile editor">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Full name"
            className="w-full rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none"
          />
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Username"
            className="w-full rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none"
          />
          <div>
            <label className="mb-1 block text-sm font-medium">Profile picture</label>
            <input type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} className="block w-full text-sm" />
          </div>
          <input
            value={user?.email || ""}
            disabled
            aria-label="Email address"
            className="w-full cursor-not-allowed rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-black/40"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button disabled={saving} className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button type="button" onClick={onClose} className="rounded-full border border-black/15 px-5 py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
