import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

const adminMenus = [
  { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/customers", icon: "bi-people", label: "Pelanggan" },
  { to: "/water-usage", icon: "bi-droplet", label: "Cek Air" },
  { to: "/payments", icon: "bi-cash-coin", label: "Bayar Air" },
  { to: "/reports", icon: "bi-bar-chart", label: "Laporan" },
  { to: "/rates", icon: "bi-tag", label: "Tarif" },
  { to: "/users", icon: "bi-person-badge", label: "Petugas" },
];

const operatorMenus = [
  { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/water-usage", icon: "bi-droplet", label: "Cek Air" },
  { to: "/payments", icon: "bi-cash-coin", label: "Bayar Air" },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const isAdmin = user?.level === "0";
  const menus = isAdmin ? adminMenus : operatorMenus;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <i className="bi bi-droplet-fill text-white me-2 fs-5" />
        <span>Cikaret Setra</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-label">Menu</div>
        {menus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${menu.icon}`} />
            <span>{menu.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
