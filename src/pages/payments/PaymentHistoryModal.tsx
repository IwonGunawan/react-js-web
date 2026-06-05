import { useState, useEffect } from "react";
import {
  paymentService,
  type PaymentHistory,
} from "../../services/payment.service";
import { type WaterUsageCustomer } from "../../services/water-usage.service";
import { Spinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { formatRupiah, STATUS_MAP } from "../../utils";
import Pagination from "../../components/ui/Pagination";

const LIMIT = 10;
interface Props {
  customer: WaterUsageCustomer;
  onClose: () => void;
}

export default function PaymentHistoryModal({ customer, onClose }: Props) {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    paymentService
      .getByCustomer(customer.customerId, { page, limit: LIMIT })
      .then((res) => {
        setHistory(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalData(res.meta.totalData);
      })
      .finally(() => setIsLoading(false));
  }, [customer.customerId, page]);

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
                {totalData > 0 && (
                  <span className="ms-1 text-muted">
                    ({totalData} transaksi)
                  </span>
                )}
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
                    <th className="text-end">Tunai</th>
                    <th className="text-end">Sisa</th>
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
                      <td className="text-end small">{formatRupiah(h.cash)}</td>
                      <td className="text-center small">
                        {[2, 3].includes(h.status)
                          ? formatRupiah(Math.abs(h.total - h.cash))
                          : ""}
                        <p
                          className={`badge ${STATUS_MAP[String(h.status)].className} d-block mt-1`}
                        >
                          {STATUS_MAP[String(h.status)].label}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer justify-content-between">
            {/* Pagination di kiri, tombol tutup di kanan */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => setPage(p)}
            />
            <button className="btn btn-sm btn-light" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
