import { useAuthStore } from "../../stores/auth.store";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Dashboard</h5>
          <p className="text-muted small mb-0">
            Selamat datang kembali, {user?.name}
          </p>
        </div>
      </div>

      {/* Stat Cards — placeholder, nanti diisi data real */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Pemasukan Bulan Ini",
            value: "Rp 0",
            icon: "bi-cash-stack",
            color: "#e8f5e9",
            iconColor: "var(--cs-primary)",
          },
          {
            label: "Sudah Lunas",
            value: "0",
            icon: "bi-check-circle",
            color: "#e3f2fd",
            iconColor: "#1565c0",
          },
          {
            label: "Belum Bayar",
            value: "0",
            icon: "bi-exclamation-circle",
            color: "#fff3e0",
            iconColor: "#e65100",
          },
          {
            label: "Total Tunggakan",
            value: "Rp 0",
            icon: "bi-clock-history",
            color: "#fce4ec",
            iconColor: "#c62828",
          },
        ].map((stat) => (
          <div key={stat.label} className="col-md-6 col-xl-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">{stat.label}</p>
                  <h5 className="fw-bold mb-0">{stat.value}</h5>
                </div>
                <div
                  className="stat-icon"
                  style={{ background: stat.color, color: stat.iconColor }}
                >
                  <i className={`bi ${stat.icon}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="stat-card">
        <p className="fw-semibold mb-3">Pemasukan 12 Bulan Terakhir</p>
        <div
          className="d-flex align-items-center justify-content-center text-muted"
          style={{ height: 200 }}
        >
          <div className="text-center">
            <i className="bi bi-bar-chart fs-1 d-block mb-2 opacity-25" />
            <span className="small">Chart akan diimplementasi di Phase 7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
