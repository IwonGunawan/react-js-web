import { useState } from "react";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { useVillage } from "../../hooks/useVillage";
import type { WaterUsageCustomer } from "../../services/water-usage.service";
import { Spinner } from "../../components/ui/Spinner";
import PaymentModal from "./PaymentModal";
import PaymentHistoryModal from "./PaymentHistoryModal";
import { usePayment } from "../../hooks/usePayment";
import { formatRupiah } from "../../utils";

export default function PaymentsPage() {
  const {
    data,
    isLoading,
    error,
    totalPages,
    totalItems,
    query,
    updateQuery,
    setPage,
    refetch,
  } = usePayment();

  const { villages } = useVillage();

  const [payModal, setPayModal] = useState<WaterUsageCustomer | null>(null);
  const [historyModal, setHistoryModal] = useState<WaterUsageCustomer | null>(
    null,
  );

  // Hanya customer yang sudah dicek (isChecked=1) yang bisa dibayar
  // const payableCount = data.filter((c) => c.isChecked === 1).length;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Bayar Air</h5>
          <p className="text-muted small mb-0">{totalItems} total pelanggan</p>
        </div>
        {/* <span className="badge badge-status-lunas">
          <i className="bi bi-check-circle me-1" />
          {payableCount} siap dibayar
        </span> */}
      </div>

      {/* Filter */}
      <div className="stat-card mb-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <SearchInput
            placeholder="Cari nama atau kode..."
            onSearch={(v) => updateQuery({ search: v })}
          />
          <select
            className="form-select form-select-sm"
            style={{ width: 160 }}
            value={query.village_id ?? ""}
            onChange={(e) =>
              updateQuery({
                village_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">Semua Wilayah</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="stat-card">
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState message="Tidak ada pelanggan ditemukan" />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Pelanggan</th>
                    <th>Kode</th>
                    <th>Total Tagihan</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.customerId}>
                      <td>
                        <p className="mb-0 fw-semibold small">{c.name}</p>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark fw-normal">
                          {c.code}
                        </span>
                      </td>
                      <td>
                        {c.finalTotal > 0 && (
                          <span className="badge badge-status-belum">
                            {formatRupiah(c.finalTotal)}
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          title="History pembayaran"
                          onClick={() => setHistoryModal(c)}
                        >
                          <i className="bi bi-receipt" />
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setPayModal(c)}
                        >
                          <i className="bi bi-cash-coin me-1" />
                          Bayar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Pagination
                page={query.page ?? 1}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {payModal && (
        <PaymentModal
          customer={payModal}
          onSaved={() => {
            setPayModal(null);
            refetch();
          }}
          onClose={() => setPayModal(null)}
        />
      )}

      {historyModal && (
        <PaymentHistoryModal
          customer={historyModal}
          onClose={() => setHistoryModal(null)}
        />
      )}
    </div>
  );
}
