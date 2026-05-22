import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-wrapper w-100">
        <Navbar />
        <main className="main-content">
          {/* Outlet = child route yang aktif akan dirender di sini */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
