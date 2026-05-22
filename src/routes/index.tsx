import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MainLayout from "../components/shared/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // semua route dibawah protectedRoute harus login
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    // admin only routes
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      // routing khusus admin
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
