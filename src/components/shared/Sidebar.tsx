import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { NAV_GROUPS } from "../../routes/pageMeta";

interface Props {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.level === "0";

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isAdmin || !item.adminOnly),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="sidebar" id="app-sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-droplet-fill sidebar-logo" aria-hidden="true" />
        <span>Cikaret Setra</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {groups.map((group) => (
          <div className="sidebar-group" key={group.label}>
            <div className="sidebar-label">{group.label}</div>
            {group.items.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
                title={menu.label}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <i className={`bi ${menu.icon}`} aria-hidden="true" />
                <span>{menu.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-user" title={user?.name}>
          <div className="avatar">{initials}</div>
          <div className="meta">
            <div className="name">{user?.name}</div>
            <div className="role">{isAdmin ? "Administrator" : "Operator"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
