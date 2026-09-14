import { useState } from "react";
// import userIcon from "../assets/user-icon.svg";

import { Link } from "react-router-dom";
import userIcon from "../assets/user-icon.png";
import AccountMenu from "@/components/AccountMenu";
import { Search, ShoppingCart, Menu, ChevronDown, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { label: "Shop", hasDropdown: true },
  { label: "On Sale" },
  { label: "New Arrivals" },
  { label: "Brands" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-container items-center justify-between py-5">
        {/* ---------------- MOBILE ---------------- */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>

            <Link
              to="/"
              className="font-integral text-[32px] font-bold leading-none"
            >
              SHOP.CO
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button>
              <Search size={28} />
            </button>

            <Link to="/cart" className="relative">
              <ShoppingCart size={28} />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <AccountMenu iconSize={28} />
          </div>
        </div>

        {/* ---------------- DESKTOP ---------------- */}
        <div className="hidden w-full items-center justify-between lg:flex">
          <Link
            to="/"
            className="font-integral text-3xl font-bold tracking-tight"
          >
            SHOP.CO
          </Link>

          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.label === "Shop" ? "/category/casual" : "#"}
                className="flex items-center gap-1 font-satoshi text-sm"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} />}
              </a>
            ))}
          </nav>

          <div className="flex w-[40%] items-center gap-3 rounded-full bg-surface-100 px-4 py-3">
            <Search size={18} className="text-black/40" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <AccountMenu iconSize={22} />
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {open && (
        <div className="border-t border-black/10 px-[4%] py-5 lg:hidden">
          <div className="mb-5 flex items-center gap-3 rounded-full bg-surface-100 px-4 py-3">
            <Search size={18} className="text-black/40" />

            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
            />
          </div>

          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.label === "Shop" ? "/category/casual" : "#"}
                className="flex items-center justify-between text-base font-medium"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={18} />}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
