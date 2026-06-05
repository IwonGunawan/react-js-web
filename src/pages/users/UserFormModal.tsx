import { useState, useEffect } from "react";
import { userService, type AppUser } from "../../services/user.service";

interface Props {
  user: AppUser | null;
  onSaved: () => void;
  onClose: () => void;
}

export default function UserFormModal({ user, onSaved, onClose }: Props) {
  const isEdit = user !== null;

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    level: user?.level ?? ("1" as "0" | "1"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        level: user.level,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isEdit && user) {
        await userService.update(user.id, {
          name: form.name,
          email: form.email,
          level: form.level,
        });
      } else {
        await userService.create({
          name: form.name,
          email: form.email,
          password: form.password,
          level: form.level,
        });
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title fw-bold">
              {isEdit ? "Edit Petugas" : "Tambah Petugas"}
            </h6>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Nama</label>
                <input
                  name="name"
                  className="form-control form-control-sm"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control form-control-sm"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isEdit && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="form-control form-control-sm"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                    placeholder="Min. 6 karakter"
                  />
                </div>
              )}

              <div className="mb-0">
                <label className="form-label small fw-semibold">Role</label>
                <select
                  name="level"
                  className="form-select form-select-sm"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option value="1">Operator</option>
                  <option value="0">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1" />
                    {isEdit ? "Simpan" : "Tambah"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
