import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paradise-skySoft" data-testid="auth-loading">
        <div className="text-paradise-navy text-lg font-display">Loading…</div>
      </div>
    );
  }
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}
