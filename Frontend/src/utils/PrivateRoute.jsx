import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔒 Not logged in
  if (!token || !user.email) {
    return <Navigate to="/" replace />;
  }

  // 🔒 Admin-only route protection
  if (adminOnly && !(user.isAdmin || user.role === "admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}