import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

export function Protected({ children }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated());

  if (!isAuthed) {
    console.warn("Protected: User not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RequireRole({ role, children }) {
  const hasRole = useAuthStore((s) => s.hasRole);

  if (!hasRole(role)) {
    console.warn(`RequireRole: Missing role ${role}, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  return children;
}
