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
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h6 className="modal-title fw-bold mb-0">
                Top 10 Tunggakan Terbesar
              </h6>
              <p className="text-muted small mb-0">
                Total:{" "}
                <span className="fw-semibold text-danger">
                  {formatRupiah(total)}
                </span>
              </p>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3" style={{ width: 40 }}>
                    #
                  </th>
                  <th>Pelanggan</th>
                  <th className="text-end pe-3">Tunggakan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((a, index) => (
                  <tr key={a.customerId}>
                    <td className="ps-3">
                      <span
                        className="d-flex align-items-center justify-content-center rounded-circle fw-bold mx-auto"
                        style={{
                          width: 26,
                          height: 26,
                          fontSize: "0.75rem",
                          background:
                            index === 0
                              ? "#fce4ec"
                              : index === 1
                                ? "#fff3e0"
                                : index === 2
                                  ? "#e8f5e9"
                                  : "#f5f5f5",
                          color:
                            index === 0
                              ? "#c62828"
                              : index === 1
                                ? "#e65100"
                                : index === 2
                                  ? "#2e7d32"
                                  : "#666",
                        }}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <p className="mb-0 small fw-semibold">{a.name}</p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {a.code}
                      </p>
                    </td>
                    <td className="text-end pe-3">
                      <span className="badge badge-status-kurang">
                        {formatRupiah(a.arrearsAmount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Footer total */}
              <tfoot className="table-light">
                <tr>
                  <td colSpan={2} className="ps-3 fw-semibold small">
                    Total
                  </td>
                  <td className="text-end pe-3 fw-bold text-danger small">
                    {formatRupiah(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
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
