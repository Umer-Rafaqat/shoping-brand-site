import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users as UsersIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="flex w-64 shrink-0 flex-col border-r border-black/10 bg-white">
        <div className="border-b border-black/10 px-6 py-5">
          <span className="text-xl font-bold tracking-tight">SHOP.CO</span>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-black/40">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

      <main className="flex-1 bg-surface-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}
