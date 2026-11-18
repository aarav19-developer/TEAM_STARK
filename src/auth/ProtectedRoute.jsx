import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * ProtectedRoute — reads isAuthenticated from React context (not raw sessionStorage).
 * This means when logout() is called anywhere (e.g. LogoutOnVisit),
 * this component re-renders immediately and redirects to /login.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}
