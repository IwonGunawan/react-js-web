import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

interface Props {
  allowedRoles?: ("admin" | "petugas")[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuth, user } = useAuthStore();

  // jika belum login, direct ke login
  if (!isAuth) return <Navigate to="/login" replace />;

  // jika ada role restriction
  if (allowedRoles) {
    const roleMap: Record<string, "admin" | "petugas"> = {
      "0": "admin",
      "1": "petugas",
    };
    const userRole = roleMap[user?.level ?? "1"];
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // loloc semua check -> render child routes
  return <Outlet />;
}
