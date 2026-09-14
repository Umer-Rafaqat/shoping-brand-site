import { AlertTriangle, X } from "lucide-react";

// A reusable, styled replacement for window.confirm(). Renders a centered
// modal with a backdrop, works on any screen size, and lets the caller
// customize the wording per action (delete a product vs delete a user, etc).
export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                danger
                  ? "bg-brand-pink text-brand-red"
                  : "bg-black/5 text-black/60"
              }`}
            >
              <AlertTriangle size={18} />
            </span>
            <h2 className="text-base font-bold">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="shrink-0 text-black/40 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm text-black/60">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-black hover:bg-black/85"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
