import { useEffect, useState } from "react";
import Badge, { type BadgeTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { Spinner } from "../../components/ui/Spinner";
import {
  paymentService,
  type PaymentHistory,
} from "../../services/payment.service";
import { type WaterUsageCustomer } from "../../services/water-usage.service";
import { formatRupiah, STATUS_MAP } from "../../utils";

const LIMIT = 10;

const STATUS_TONE: Record<string, BadgeTone> = {
  "0": "warning",
  "1": "success",
  "2": "danger",
  "3": "info",
};

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
    <Modal
      size="lg"
      title="History Pembayaran"
      description={
        <>
          {customer.prefix} {customer.name} — {customer.code}
          {totalData > 0 && (
            <span className="ms-1">({totalData} transaksi)</span>
          )}
        </>
      }
      onClose={onClose}
      bodyClassName="is-flush"
      footer={
        <>
          <div className="me-auto">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => setPage(p)}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </>
      }
    >
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
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th className="text-end">Tagihan</th>
                <th className="text-end">Tunai</th>
                <th className="text-end">Sisa</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>
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
                  <td className="text-end small">
                    {[2, 3].includes(h.status)
                      ? formatRupiah(Math.abs(h.total - h.cash))
                      : "—"}
                  </td>
                  <td className="text-end">
                    <Badge tone={STATUS_TONE[String(h.status)] ?? "neutral"}>
                      {STATUS_MAP[String(h.status)]?.label ?? "-"}
                    </Badge>
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
