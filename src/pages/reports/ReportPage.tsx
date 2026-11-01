import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import MonthlyReport from "./MonthlyReport";
import UnpaidReport from "./UnpaidReport";

type Tab = "monthly" | "unpaid";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("monthly");

  // Shared filter state — dipakai kedua tab
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div>
      <PageHeader
        title="Laporan"
        description="Data rekap pembayaran dan tunggakan"
      />

      {/* Filter periode — shared untuk semua tab */}
      <div className="stat-card mb-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="small text-muted fw-semibold me-1">Periode:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: 130 }}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: 90 }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {(
          [
            { key: "monthly", label: "Rekap Pembayaran", icon: "bi-receipt" },
            {
              key: "unpaid",
              label: "Belum Bayar",
              icon: "bi-exclamation-circle",
            },
          ] as { key: Tab; label: string; icon: string }[]
        ).map((t) => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link ${activeTab === t.key ? "active fw-semibold" : "text-muted"}`}
              style={
                activeTab === t.key
                  ? {
                      color: "var(--cs-primary)",
                      borderBottomColor: "var(--cs-primary)",
                    }
                  : {}
              }
              onClick={() => setActiveTab(t.key)}
            >
              <i className={`bi ${t.icon} me-1`} />
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      {activeTab === "monthly" ? (
        <MonthlyReport month={month} year={year} />
      ) : (
        <UnpaidReport month={month} year={year} />
      )}
    </div>
  );
}
