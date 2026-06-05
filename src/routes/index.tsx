import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MainLayout from "../components/shared/MainLayout";
import CustomerPage from "../pages/customers/CustomerPage";
import WaterUsagePage from "../pages/water-usage/WaterUsagePage";
import PaymentsPage from "../pages/payments/PaymentPage";
import ReportsPage from "../pages/reports/ReportPage";
import UsersPage from "../pages/users/UserPage";
import RatesPage from "../pages/rates/RatePage";

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
          {
            path: "/water-usage",
            element: <WaterUsagePage />,
          },
          {
            path: "/payments",
            element: <PaymentsPage />,
          },
        ],
      },
    ],
  },
  {
    // admin only routes
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/customers",
            element: <CustomerPage />,
          },
          {
            path: "/reports",
            element: <ReportsPage />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "rates",
            element: <RatesPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
