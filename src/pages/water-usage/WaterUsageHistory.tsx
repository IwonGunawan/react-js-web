import { useWaterUsageHistory } from "../../hooks/useWaterUsage";
import {
  waterUsageService,
  type WaterUsageCustomer,
} from "../../services/water-usage.service";
import EmptyState from "../../components/ui/EmptyState";
import { useState } from "react";
import { Spinner } from "../../components/ui/Spinner";
import { MONTH_NAMES } from "../../utils";

interface Props {
  customer: WaterUsageCustomer;
  onClose: () => void;
}

export default function WaterUsageHistoryModal({ customer, onClose }: Props) {
  const { history, isLoading, refetch } = useWaterUsageHistory(
    customer.customerId,
  );
  const [replacing, setReplacing] = useState<number | null>(null);

  const handleMarkReplaced = async (id: number) => {
    if (!confirm("Tandai meter ini yang akan diganti ?")) return;
    setReplacing(id);
    try {
      await waterUsageService.markReplaced(id);
      refetch();
    } finally {
      setReplacing(null);
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
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h6 className="modal-title fw-bold mb-0">History Pemakaian</h6>
              <p className="text-muted small mb-0">
                {customer.prefix} {customer.name} — {customer.code}
              </p>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body p-0">
            {isLoading ? (
              <Spinner />
            ) : history.length === 0 ? (
              <div className="p-3">
                <EmptyState
                  message="Belum ada history pemakaian"
                  icons="bi-droplet"
                />
              </div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Bulan</th>
                    <th className="text-center">Meter</th>
                    <th className="text-center">Pakai (m³)</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, index) => (
                    <tr key={h.id}>
                      <td className="ps-3 small fw-semibold">
                        {MONTH_NAMES[h.month]} {h.year}
                        {h.lastUsed === "1" && (
                          <span
                            className="badge bg-warning text-dark ms-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Meter Lama
                          </span>
                        )}
                      </td>
                      <td className="text-center small">{h.meterNumber}</td>
                      <td className="text-center small fw-semibold">
                        {h.meterUsage}
                      </td>
                      <td className="text-end pe-2">
                        {/* Hanya tampil kalau lastUsed = '0' — meter belum ditandai diganti */}
                        {h.lastUsed === "0" && index == 0 && (
                          <button
                            className="btn btn-xs btn-outline-warning"
                            style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                            onClick={() => handleMarkReplaced(h.id)}
                            disabled={replacing === h.id}
                            title="Tandai meter diganti"
                          >
                            {replacing === h.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <>
                                <i className="bi bi-wrench me-1" />
                                Ganti Meter
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-sm btn-light" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
