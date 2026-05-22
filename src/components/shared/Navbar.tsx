import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="main-navbar">
      {/* Kiri: page title bisa ditambahkan di sini */}
      <div className="flex-grow-1" />

      {/* Kanan: user info + logout */}
      <div className="d-flex align-items-center gap-3">
        <div className="text-end">
          <div className="fw-semibold small">{user?.name}</div>
          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
            {user?.level === "0" ? "Admin" : "Operator"}
          </div>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <span className="dropdown-item-text small text-muted">
                {user?.email}
              </span>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger small"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
