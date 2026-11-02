import { useState, useEffect } from "react";
import { userService, type AppUser } from "../../services/user.service";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import { TableSkeleton } from "../../components/ui/Skeleton";
import UserFormModal from "./UserFormModal";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<AppUser | "create" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    let cancelled = false;
    userService
      .getAll()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleResetPassword = async (user: AppUser) => {
    if (!confirm(`Reset password akun ${user.name} ke password default?`)) {
      return;
    }
    const res = await userService.resetPassword(user.id);
    setNotice(`Password ${user.name} direset ke "${res.defaultPassword}".`);
  };

  const handleToggleStatus = async (user: AppUser) => {
    const action = user.status === "0" ? "nonaktifkan" : "aktifkan";
    if (!confirm(`${action} akun ${user.name}?`)) return;
    await userService.toggleStatus(user.id);
    fetchUsers();
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Petugas"
        description={`${users.length} akun terdaftar`}
        actions={
          <Button
            size="sm"
            icon="bi-plus-lg"
            onClick={() => setModal("create")}
          >
            Tambah Petugas
          </Button>
        }
      />

      {notice && (
        <div
          className="alert alert-success d-flex align-items-center justify-content-between gap-2"
          role="status"
        >
          <span className="small">{notice}</span>
          <Button
            variant="ghost"
            size="sm"
            icon="bi-x"
            aria-label="Tutup pesan"
            onClick={() => setNotice(null)}
          />
        </div>
      )}

      <div className="list-card">
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
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
                      <Badge tone={u.level === "0" ? "info" : "neutral"}>
                        {u.level === "0" ? "Admin" : "Operator"}
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={u.status === "0" ? "success" : "danger"} dot>
                        {u.status === "0" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="bi-pencil"
                        aria-label={`Edit ${u.name}`}
                        className="me-1"
                        onClick={() => setModal(u)}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="bi-key"
                        aria-label={`Reset password ${u.name}`}
                        className="me-1"
                        onClick={() => handleResetPassword(u)}
                      />
                      <Button
                        variant={u.status === "0" ? "danger" : "secondary"}
                        size="sm"
                        icon={u.status === "0" ? "bi-slash-circle" : "bi-check-circle"}
                        aria-label={u.status === "0" ? `Nonaktifkan ${u.name}` : `Aktifkan ${u.name}`}
                        onClick={() => handleToggleStatus(u)}
                      />
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
          key={modal === "create" ? "new" : modal.id}
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
