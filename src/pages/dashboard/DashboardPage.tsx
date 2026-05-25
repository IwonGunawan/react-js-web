import EmptyState from "../../components/ui/EmptyState";
import { Spinner } from "../../components/ui/Spinner";
import { useDashboard } from "../../hooks/useDashboard";
import type { IncomeChart } from "../../services/dashboard.service";
import { useAuthStore } from "../../stores/auth.store";
import { formatRupiah, MONTH_NAMES } from "../../utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { summary, isLoading, error } = useDashboard();

  if (isLoading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const stats = summary
    ? [
        {
          label: "Pemasukan Bulan Ini",
          value: formatRupiah(summary.incomeThisMonth),
          icon: "bi-cash-stack",
          bgColor: "#e8f5e9",
          iconColor: "var(--cs-primary)",
        },
        {
          label: "Sudah Lunas",
          value: summary.paidCount.toString(),
          icon: "bi-check-circle",
          bgColor: "#e3f2fd",
          iconColor: "#1565c0",
        },
        {
          label: "Belum Bayar",
          value: summary.unpaidCount.toString(),
          icon: "bi-exclamation-circle",
          bgColor: "#fff3e0",
          iconColor: "#e65100",
        },
        {
          label: "Total Tunggakan Teratas",
          value:
            summary.topArrears.length > 0
              ? formatRupiah(
                  summary.topArrears.reduce((s, a) => s + a.arrearsAmount, 0),
                )
              : "Rp.0",
          icon: "bi-clock-history",
          bgColor: "#fce4ec",
          iconColor: "#c62828",
        },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Dashboard</h5>
          <p className="text-muted small mb-0">
            Selamat datang kembali, {user?.name} -{" "}
            {MONTH_NAMES[summary?.thisMonth.month ?? 0]}{" "}
            {summary?.thisMonth.year}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="col-md-6 col-xl-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-item-start">
                <div>
                  <p className="text-muted small mb-1">{s.label}</p>
                  <h5 className="fw-bold mb-0">{s.value}</h5>
                </div>
                <div
                  className="stat-icon"
                  style={{ background: s.bgColor, color: s.iconColor }}
                >
                  <i className={`bi ${s.icon}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* chart area */}
      <div className="row g-3">
        {/* Income chart (simple bar) */}
        <div className="col-xl-8">
          <div className="stat-card h-100">
            <p className="fw-semibold mb-3">Pemasukan 6 bulan terakhir</p>
            {summary && summary.incomeChart.length > 0 ? (
              <IncomeChart data={summary.incomeChart} />
            ) : (
              <EmptyState message="Tidak ada data" icons="bi-bar-chart" />
            )}
          </div>
        </div>

        {/* Top Appers */}
        <div className="col-xl-4">
          <div className="stat-card h-100">
            <p className="fw-semibold mb-3">Tunggakan Terbesar</p>
            {summary && summary.topArrears.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {summary.topArrears.slice(0, 5).map((a) => (
                  <div
                    key={a.customerId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p className="mb-0 small fw-semibold">{a.name}</p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {a.code}
                      </p>
                    </div>
                    <span className="badge badge-status-kurang">
                      {formatRupiah(a.arrearsAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="Tidak ada tunggakan"
                icons="bi-check-circle"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// simple bar chart
function IncomeChart({ data }: { data: IncomeChart[] }) {
  const max = Math.max(...data.map((a) => a.total));

  return (
    <div className="d-flex align-items-end gap-2" style={{ height: 220 }}>
      {data.map((dta) => {
        const height = max > 0 ? (dta.total / max) * 200 : 0;
        return (
          <div
            key={`${dta.year}-${dta.month}`}
            className="d-flex flex-column align-items-center flex-grow-1"
            title={formatRupiah(dta.total)}
          >
            <span
              className="text-muted mb-1"
              style={{
                fontSize: "0.7rem",
                fontWeight: 300,
                whiteSpace: "nowrap",
              }}
            >
              {formatRupiah(dta.total)}
            </span>
            <div
              style={{
                width: "100%",
                height: `${height}px`,
                background: "var(--cs-primary)",
                borderRadius: "4px 4px 0px 0px",
                opacity: 0.85,
                transition: "height 0.3s ease",
                cursor: "pointer",
              }}
              className="chart-bar"
            />
            <span style={{ fontSize: "0.65 rem" }} className="text-muted mt-1">
              {MONTH_NAMES[dta.month]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
