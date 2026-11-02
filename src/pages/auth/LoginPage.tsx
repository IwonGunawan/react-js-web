import React, { useState } from "react";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../utils";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pre-check supaya pesan error konsisten (tidak bergantung
    // pada tooltip bawaan browser untuk field required).
    if (!email.trim() || !password) {
      setError("Username & Password wajib diisi");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { access_token, user } = await authService.login(email, password);
      setAuth(user, access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Username atau Password salah"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Panel brand — disembunyikan di layar kecil */}
      <section className="login-brand-panel">
        <div className="login-brand-row">
          <span className="logo">
            <i className="bi bi-droplet-fill" aria-hidden="true" />
          </span>
          <span className="name">Cikaret Setra</span>
        </div>

        <div className="login-brand-copy">
          <h2>
            Sistem pembayaran air
            <br />
            yang rapi dan terukur.
          </h2>
          <p>
            Kelola pelanggan, pencatatan meter, pembayaran, hingga laporan
            bulanan dalam satu tempat.
          </p>

          <ul className="login-features">
            <li>
              <span className="tick">
                <i className="bi bi-check-lg" aria-hidden="true" />
              </span>
              Data pelanggan &amp; tarif terpusat
            </li>
            <li>
              <span className="tick">
                <i className="bi bi-check-lg" aria-hidden="true" />
              </span>
              Catat meter dan pembayaran lebih cepat
            </li>
            <li>
              <span className="tick">
                <i className="bi bi-check-lg" aria-hidden="true" />
              </span>
              Laporan tunggakan otomatis
            </li>
          </ul>
        </div>

        <div className="login-brand-foot">
          © 2026 Cikaret Setra · Sistem Pembayaran Air
        </div>
      </section>

      {/* Panel form */}
      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <span className="eyebrow">Portal Petugas</span>
          <h1>Masuk ke akun Anda</h1>
          <p className="sub">
            Gunakan username dan password yang diberikan administrator.
          </p>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 mb-3"
              role="alert"
            >
              <i className="bi bi-exclamation-circle" aria-hidden="true" />
              {error}
            </div>
          )}

          <Field label="Username" htmlFor="login-username" className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person" aria-hidden="true" />
              </span>
              <Input
                id="login-username"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan username"
                autoComplete="username"
                disabled={isLoading}
                autoFocus
                required
              />
            </div>
          </Field>

          <Field label="Password" htmlFor="login-password" className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock" aria-hidden="true" />
              </span>
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
              <Button
                variant="secondary"
                icon={showPassword ? "bi-eye-slash" : "bi-eye"}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                onClick={() => setShowPassword((value) => !value)}
              />
            </div>
          </Field>

          <div className="form-check my-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="login-remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label
              className="form-check-label small text-muted"
              htmlFor="login-remember"
            >
              Ingat saya di perangkat ini
            </label>
          </div>

          <Button
            type="submit"
            block
            loading={isLoading}
            icon="bi-arrow-right"
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </Button>

          <p className="login-foot">
            Butuh bantuan? Hubungi kantor pengelola air setempat.
          </p>
        </form>
      </section>
    </div>
  );
}
