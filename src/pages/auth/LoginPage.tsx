import React, { useState } from "react";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { access_token, user } = await authService.login(email, password);
      setAuth(user, access_token);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Gagal login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: 64, height: 64, background: "#e8f5e9" }}
          >
            <i
              className="bi bi-droplet-fill fs-3"
              style={{ color: "var(--cs-primary)" }}
            />
          </div>
          <h4 className="fw-bold mb-0">Cikaret Setra</h4>
          <p className="text-muted small">Sistem Pembayaran Air</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            <i className="bi bi-exclamation-circle me-2" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope text-muted" />
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock text-muted" />
              </span>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Masuk...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2" />
                Masuk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
