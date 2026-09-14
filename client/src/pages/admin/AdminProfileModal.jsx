import { useEffect, useState } from "react";
import { X, Check, ImagePlus } from "lucide-react";
import { updateAdminProfileAPI } from "@/api/auth.api";
import { assetUrl } from "@/lib/assetUrl";

export default function AdminProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Local preview for a newly-picked file; falls back to the current saved
  // avatar, then to initials if there's no avatar at all.
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const initials = (user?.name || "?").charAt(0).toUpperCase();
  const currentAvatarUrl =
    avatarPreview || (user?.avatarUrl ? assetUrl(user.avatarUrl) : null);

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
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex-row">
        {/* Avatar panel */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-surface-100 px-6 py-8 sm:w-64">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-black/5 shadow-sm">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-black/20">
                  {initials}
                </span>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white ring-4 ring-surface-100">
              <Check size={14} />
            </span>
          </div>

          <label className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium hover:bg-black/5">
            <ImagePlus size={14} />
            Edit picture
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setAvatarFile(event.target.files?.[0] || null)
              }
              className="hidden"
            />
          </label>
          <p className="text-center text-xs leading-relaxed text-black/40">
            You can edit your profile picture or upload a new one (JPG or PNG)
          </p>
        </div>

        {/* Form panel */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Admin Profile</h2>
              {/* <p className="mt-1 text-xs text-black/50">
                Email can't be changed here.
              </p> */}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile editor"
              className="text-black/40 hover:text-black"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/50">
                Full name
              </label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Full name"
                className="w-full rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/50">
                Username
              </label>
              <input
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
                placeholder="Username"
                className="w-full rounded-xl border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/50">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                aria-label="Email address"
                className="w-full cursor-not-allowed rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-black/40"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-full border border-black/15 px-5 py-2.5 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
