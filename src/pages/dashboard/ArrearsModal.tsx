import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { formatRupiah } from "../../utils";

export default function ArrearsModal({
  data,
  onClose,
}: {
  data: {
    customerId: number;
    name: string;
    code: string;
    arrearsAmount: number;
  }[];
  onClose: () => void;
}) {
  const total = data.reduce((s, a) => s + a.arrearsAmount, 0);

  return (
    <Modal
      title="Top 10 Tunggakan Terbesar"
      description={
        <>
          Total:{" "}
          <span className="fw-semibold text-danger">{formatRupiah(total)}</span>
        </>
      }
      onClose={onClose}
      bodyClassName="is-flush"
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Pelanggan</th>
              <th className="text-end">Tunggakan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a, index) => (
              <tr key={a.customerId}>
                <td>
                  <span className={`rank-circle ${index === 0 ? "top" : ""}`}>
                    {index + 1}
                  </span>
                </td>
                <td>
                  <p className="mb-0 small fw-semibold">{a.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>
                    {a.code}
                  </p>
                </td>
                <td className="text-end">
                  <Badge tone="danger">{formatRupiah(a.arrearsAmount)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="fw-semibold small">
                Total
              </td>
              <td className="text-end fw-bold text-danger small">
                {formatRupiah(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Modal>
  );
}
