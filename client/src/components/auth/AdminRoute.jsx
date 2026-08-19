import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-black/50">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role?.name !== "admin") return <Navigate to="/" replace />;

  return children;
}
