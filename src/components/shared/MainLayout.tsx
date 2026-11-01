import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const COLLAPSE_KEY = "cs-sidebar-collapsed";

export default function MainLayout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "1",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Tutup drawer setiap pindah halaman (derived state saat render).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  // Kunci scroll body saat drawer mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div
      className={[
        "app-shell",
        collapsed ? "is-collapsed" : "",
        mobileOpen ? "is-mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Sidebar onNavigate={() => setMobileOpen(false)} />

      <div className="app-main">
        <Navbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
