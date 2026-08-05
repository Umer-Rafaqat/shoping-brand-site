import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "Enter your password",
  error,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-full border px-5 py-3 ${
          error ? "border-red-400" : "border-black/15"
        }`}
      >
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent font-satoshi text-sm outline-none placeholder:text-black/40"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="shrink-0 text-black/40 hover:text-black"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 font-satoshi text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
