import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Package,
  ShoppingCart,
  LogOut,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminProfileModal from "@/pages/admin/AdminProfileModal";
import { assetUrl } from "@/lib/assetUrl";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/cart-activity", label: "Cart Activity", icon: ShoppingCart },
];

export default function AdminLayout() {
  const { user, logout, updateUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Backdrop — only rendered (and only needed) on small screens, while the drawer is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-black/10 bg-white transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <span className="text-xl font-bold tracking-tight">SHOP.CO</span>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-black/40">
              Admin Panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="text-black/40 hover:text-black lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-black/10 p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-black/40">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-surface-100">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="text-black/60 hover:text-black lg:hidden"
            >
              <Menu size={22} />
            </button>
            <span className="text-sm font-medium text-black/50">
              Store Management
            </span>
          </div>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 rounded-full py-1 pr-2 text-left hover:bg-black/5"
          >
            {user?.avatarUrl ? (
              <img
                src={assetUrl(user.avatarUrl)}
                alt="Admin profile"
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <UserRound size={18} />
              </span>
            )}
            <span className="hidden text-sm font-medium sm:block">
              {user?.username || user?.name}
            </span>
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {profileOpen && (
        <AdminProfileModal
          user={user}
          onClose={() => setProfileOpen(false)}
          onUpdated={updateUser}
        />
      )}
    </div>
  );
}
