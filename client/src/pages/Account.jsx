import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { updateProfileAPI, changePasswordAPI } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { ImagePlus, Package } from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";

const inputClass = (hasError) =>
  `w-full rounded-full border px-5 py-3 text-sm outline-none placeholder:text-black/40 ${
    hasError ? "border-red-400" : "border-black/15"
  }`;

export default function Account() {
  const { user, updateUser, removeAccount } = useAuth();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold uppercase">My Account</h1>
      <p className="mt-1 text-sm text-black/60">
        Manage your profile, password, and account.
      </p>

      <ProfileSection user={user} onUpdated={updateUser} />
      <div className="my-10 border-t border-black/10" />

      <section>
        <h2 className="text-lg font-bold">Orders</h2>
        <p className="mt-1 text-sm text-black/60">
          View your order history and track current orders.
        </p>
        <Link
          to="/orders"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium hover:bg-black/5"
        >
          <Package size={16} />
          View Order History
        </Link>
      </section>
      <div className="my-10 border-t border-black/10" />

      <PasswordSection />
      <div className="my-10 border-t border-black/10" />
      <DangerZone onDelete={removeAccount} />
    </div>
  );
}

function ProfileSection({ user, onUpdated }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const initial = (user?.name || "?").charAt(0).toUpperCase();
  const currentAvatarUrl =
    avatarPreview || (user?.avatarUrl ? assetUrl(user.avatarUrl) : null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateProfileAPI({ ...form, avatarFile });
      onUpdated(updated);
      setAvatarFile(null);
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setMessage({
          type: "error",
          text: data?.message || "Something went wrong.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-bold">Profile</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/5">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={user?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-black/30">{initial}</span>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs font-medium hover:bg-black/5">
            <ImagePlus size={14} />
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Full name"
            className={inputClass(errors.name)}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Email address"
            className={inputClass(errors.email)}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}
          >
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </section>
  );
}

function PasswordSection() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage(null);
  };

  const validate = () => {
    const next = {};
    if (!form.currentPassword)
      next.currentPassword = "Enter your current password.";
    if (!form.newPassword) next.newPassword = "Enter a new password.";
    else if (form.newPassword.length < 8)
      next.newPassword = "Must be at least 8 characters.";
    if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setMessage(null);
    try {
      await changePasswordAPI({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Password changed successfully." });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setMessage({
          type: "error",
          text: data?.message || "Something went wrong.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-bold">Change Password</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <input
            type="password"
            value={form.currentPassword}
            onChange={handleChange("currentPassword")}
            placeholder="Current password"
            className={inputClass(errors.currentPassword)}
          />
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            value={form.newPassword}
            onChange={handleChange("newPassword")}
            placeholder="New password"
            className={inputClass(errors.newPassword)}
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-500">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Confirm new password"
            className={inputClass(errors.confirmPassword)}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}
          >
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </section>
  );
}

function DangerZone({ onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setError("");
    try {
      await onDelete({ password });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setDeleting(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
      <p className="mt-1 text-sm text-black/60">
        Deleting your account is permanent and cannot be undone.
      </p>

      {!confirming ? (
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
          onClick={() => setConfirming(true)}
        >
          Delete Account
        </Button>
      ) : (
        <form onSubmit={handleDelete} className="mt-4 flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
            className={inputClass(!!error)}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" variant="destructive" disabled={deleting}>
              {deleting ? "Deleting..." : "Confirm Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
