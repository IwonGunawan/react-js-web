import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { getPageTitle } from "../../routes/pageMeta";

interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export default function Navbar({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const title = getPageTitle(location.pathname);

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (!userRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-btn d-lg-none"
          aria-label="Buka menu"
          aria-controls="app-sidebar"
          onClick={onOpenMobile}
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="icon-btn d-none d-lg-inline-grid"
          aria-label={collapsed ? "Perlebar sidebar" : "Perkecil sidebar"}
          aria-expanded={!collapsed}
          onClick={onToggleCollapse}
        >
          <i
            className={`bi ${
              collapsed ? "bi-layout-sidebar" : "bi-layout-sidebar-inset"
            }`}
            aria-hidden="true"
          />
        </button>

        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <span>Beranda</span>
          <i className="bi bi-chevron-right" aria-hidden="true" />
          <strong>{title}</strong>
        </nav>
      </div>

      <div className="topbar-right">
        <div className="topbar-user" ref={userRef}>
          <button
            type="button"
            className="user-trigger"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="avatar">{initials}</span>
            <span className="meta">
              <span className="name d-block">{user?.name}</span>
              <span className="role d-block">
                {user?.level === "0" ? "Administrator" : "Operator"}
              </span>
            </span>
            <i className="bi bi-chevron-down caret" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="user-menu" role="menu">
              <div className="user-menu-head">
                <div className="name">{user?.name}</div>
                <div className="email">{user?.email}</div>
              </div>
              <button
                type="button"
                className="user-menu-item"
                role="menuitem"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
