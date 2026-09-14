import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import userIcon from "../assets/user-icon.png";
import { useAuth } from "@/context/AuthContext";
import { assetUrl } from "@/lib/assetUrl";

export default function AccountMenu({ iconSize = 22 }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link to="/login" aria-label="Log in">
        <img
          src={userIcon}
          alt="User"
          style={{ height: iconSize, width: iconSize }}
          className="object-contain"
        />
      </Link>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center justify-center overflow-hidden rounded-full bg-black font-satoshi font-bold text-white"
        style={{
          height: iconSize + 6,
          width: iconSize + 6,
          fontSize: iconSize * 0.5,
        }}
      >
        {user.avatarUrl ? (
          <img
            src={assetUrl(user.avatarUrl)}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white py-2 shadow-lg">
          <div className="border-b border-black/10 px-4 py-3">
            <p className="font-satoshi text-sm font-bold text-black">
              {user.name}
            </p>
            <p className="truncate font-satoshi text-xs text-black/50">
              {user.email}
            </p>
          </div>

          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 font-satoshi text-sm text-black/70 hover:bg-surface-100 hover:text-black"
          >
            <UserIcon size={16} />
            My Account
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 font-satoshi text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
