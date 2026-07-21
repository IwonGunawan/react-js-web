import { useState, useEffect } from "react";
import { userService, type AppUser } from "../../services/user.service";
import EmptyState from "../../components/ui/EmptyState";
import UserFormModal from "./UserFormModal";
import { Spinner } from "../../components/ui/Spinner";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<AppUser | "create" | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: AppUser) => {
    const action = user.status === "0" ? "nonaktifkan" : "aktifkan";
    if (!confirm(`${action} akun ${user.name}?`)) return;
    await userService.toggleStatus(user.id);
    fetchUsers();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Manajemen Petugas</h5>
          <p className="text-muted small mb-0">{users.length} akun terdaftar</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setModal("create")}
        >
          <i className="bi bi-plus-lg me-1" />
          Tambah Petugas
        </button>
      </div>

      <div className="stat-card">
        {isLoading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <EmptyState message="Belum ada petugas terdaftar" />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: 32,
                            height: 32,
                            background:
                              u.level === "0"
                                ? "var(--cs-primary-soft)"
                                : "var(--cs-info-soft)",
                            color:
                              u.level === "0"
                                ? "var(--cs-primary)"
                                : "var(--cs-info)",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="small fw-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="small text-muted">{u.email}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${u.level === "0" ? "badge-status-lunas" : "badge-status-lebih"}`}
                      >
                        {u.level === "0" ? "Admin" : "Operator"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${u.status === "0" ? "badge-status-lunas" : "badge-status-kurang"}`}
                      >
                        {u.status === "0" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => setModal(u)}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className={`btn btn-sm ${u.status === "0" ? "btn-outline-danger" : "btn-outline-success"}`}
                        onClick={() => handleToggleStatus(u)}
                      >
                        <i
                          className={`bi ${u.status === "0" ? "bi-slash-circle" : "bi-check-circle"}`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <UserFormModal
          user={modal === "create" ? null : modal}
          onSaved={() => {
            setModal(null);
            fetchUsers();
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
