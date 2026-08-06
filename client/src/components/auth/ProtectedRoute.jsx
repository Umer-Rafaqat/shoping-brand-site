import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-satoshi text-sm text-black/50">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
