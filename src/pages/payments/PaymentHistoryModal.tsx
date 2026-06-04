import { useState, useEffect } from "react";
import {
  paymentService,
  type PaymentHistory,
} from "../../services/payment.service";
import { type WaterUsageCustomer } from "../../services/water-usage.service";
import { Spinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface Props {
  customer: WaterUsageCustomer;
  onClose: () => void;
}

export default function PaymentHistoryModal({ customer, onClose }: Props) {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    paymentService
      .getByCustomer(customer.customerId)
      .then((res) => setHistory(res.data))
      .finally(() => setIsLoading(false));
  }, [customer.customerId]);

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
              <h6 className="modal-title fw-bold mb-0">History Pembayaran</h6>
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
                  message="Belum ada history pembayaran"
                  icons="bi-receipt"
                />
              </div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Tanggal</th>
                    <th className="text-end">Tagihan</th>
                    <th className="text-end pe-3">Tunai</th>
                    <th className="text-end">Ket</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className="ps-3">
                        <p className="mb-0 small fw-semibold">
                          {new Date(h.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.72rem" }}
                        >
                          {new Date(h.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Jakarta",
                          })}{" "}
                          WIB
                        </p>
                      </td>
                      <td className="text-end small fw-semibold">
                        {formatRupiah(h.total)}
                      </td>
                      <td className="text-end pe-3 small">
                        {formatRupiah(h.cash)}
                      </td>
                      <td className="text-end small">
                        <p className="badge badge-status-kurang">
                          kurang bayar
                        </p>
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
