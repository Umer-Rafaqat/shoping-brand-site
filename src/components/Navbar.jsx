import { useState } from "react";
import { Link } from "react-router-dom";
import userIcon from "../assets/user-icon.svg";
import { Search, ShoppingCart, Menu, ChevronDown, X } from "lucide-react";

const links = [
  { label: "Shop", hasDropdown: true },
  { label: "On Sale" },
  { label: "New Arrivals" },
  { label: "Brands" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

            <button>
              <Link to="/cart">
                <ShoppingCart />
              </Link>
            </button>

            <button>
              <img
                src={userIcon}
                alt="User"
                className="h-7 w-7 object-contain"
              />
            </button>
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
            <Link to="/cart">
              <ShoppingCart />
            </Link>

            <img
              src={userIcon}
              alt="User"
              className="h-[22px] w-[22px] object-contain"
            />
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
