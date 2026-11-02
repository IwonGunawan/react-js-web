import { useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { useWaterUsageHistory } from "../../hooks/useWaterUsage";
import {
  waterUsageService,
  type WaterUsageCustomer,
} from "../../services/water-usage.service";
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
    <Modal
      size="lg"
      title="History Pemakaian"
      description={`${customer.prefix} ${customer.name} — ${customer.code}`}
      onClose={onClose}
      bodyClassName="is-flush"
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
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
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Bulan</th>
                <th className="text-center">Meter</th>
                <th className="text-center">Pakai (m³)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {history.map((h, index) => (
                <tr key={h.id}>
                  <td className="small fw-semibold">
                    {MONTH_NAMES[h.month]} {h.year}
                    {h.lastUsed === "1" && (
                      <Badge tone="warning" className="ms-2">
                        Meter Lama
                      </Badge>
                    )}
                  </td>
                  <td className="text-center small">{h.meterNumber}</td>
                  <td className="text-center small fw-semibold">
                    {h.meterUsage}
                  </td>
                  <td className="text-end">
                    {/* Hanya tampil kalau lastUsed = '0' — meter belum ditandai diganti */}
                    {h.lastUsed === "0" && index === 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="bi-wrench"
                        loading={replacing === h.id}
                        onClick={() => handleMarkReplaced(h.id)}
                        title="Tandai meter diganti"
                        aria-label="Tandai meter diganti"
                      >
                        <span className="d-none d-sm-inline">Ganti Meter</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
