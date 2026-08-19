import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { getUsersAPI } from "@/api/admin.api";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    getUsersAPI({ page: 1 })
      .then((data) => setTotalUsers(data.total))
      .catch(() => setTotalUsers(null));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-black/50">Overview of your store.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={UsersIcon}
          label="Total Users"
          value={totalUsers ?? "..."}
        />
      </div>

      {/* <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/50">
        Product and order management will show up here once those features are
        built — this dashboard is wired to real user data already.
      </div> */}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
        <Icon size={18} />
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm text-black/50">{label}</p>
    </div>
  );
}
