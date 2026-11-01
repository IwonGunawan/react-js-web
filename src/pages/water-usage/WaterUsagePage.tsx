import { useState } from "react";
import { useWaterUsage } from "../../hooks/useWaterUsage";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { useVillage } from "../../hooks/useVillage";
import type { WaterUsageCustomer } from "../../services/water-usage.service";
import { Spinner } from "../../components/ui/Spinner";
import InputMeterModal from "./InputMeterModal";
import WaterUsageHistoryModal from "./WaterUsageHistory";

export default function WaterUsagePage() {
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
  } = useWaterUsage();

  const { villages } = useVillage();

  const [inputModal, setInputModal] = useState<WaterUsageCustomer | null>(null);
  const [historyModal, setHistoryModal] = useState<WaterUsageCustomer | null>(
    null,
  );

  const checkedCount = data.filter((c) => c.isChecked === 1).length;
  const uncheckedCount = totalItems - checkedCount;

  return (
    <div>
      <PageHeader
        title="Cek Air"
        description={`${totalItems} total pelanggan`}
        actions={
          <div className="text-end d-none d-md-block">
            <p className="small text-muted mb-1">Progress bulan ini</p>
            <div className="d-flex align-items-center gap-2">
              <div
                className="progress flex-grow-1"
                style={{ width: 120, height: 6 }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width:
                      totalItems > 0
                        ? `${(checkedCount / totalItems) * 100}%`
                        : "0%",
                    background: "var(--cs-primary)",
                  }}
                />
              </div>
              <span className="small fw-semibold">
                {checkedCount}/{totalItems}
              </span>
            </div>
          </div>
        }
      />

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
            value={query.villageId ?? ""}
            onChange={(e) =>
              updateQuery({
                villageId: e.target.value ? Number(e.target.value) : undefined,
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

          <select
            className="form-select form-select-sm"
            style={{ width: 150 }}
            value={`${query.sortBy ?? "name"}-${query.sortOrder ?? "ASC"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                "name" | "id",
                "ASC" | "DESC",
              ];
              updateQuery({ sortBy, sortOrder });
            }}
          >
            <option value="name-ASC">Nama A-Z</option>
            <option value="name-DESC">Nama Z-A</option>
            <option value="id-ASC">ID Terlama</option>
            <option value="id-DESC">ID Terbaru</option>
          </select>
        </div>
      </div>

      {/* Summary badges */}
      <div className="d-flex gap-2 mb-3">
        <span className="badge badge-status-lunas">
          <i className="bi bi-check-circle me-1" />
          {checkedCount} sudah dicek
        </span>
        <span className="badge badge-status-belum">
          <i className="bi bi-clock me-1" />
          {uncheckedCount} belum dicek
        </span>
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
                    <th>Status</th>
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
                        {c.isChecked === 1 ? (
                          <span className="badge badge-status-lunas">
                            <i className="bi bi-droplet me-1" />
                            Sudah dicek
                          </span>
                        ) : (
                          <span className="badge badge-status-belum">
                            <i className="bi bi-clock me-1" />
                            Belum dicek
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        {c.isChecked === 0 && (
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => setInputModal(c)}
                          >
                            <i className="bi bi-pencil-square me-1" />
                            Input
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          title="History pemakaian"
                          onClick={() => setHistoryModal(c)}
                        >
                          <i className="bi bi-clock-history" />
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

      {/* Modals */}
      {inputModal && (
        <InputMeterModal
          customer={inputModal}
          onSaved={() => {
            setInputModal(null);
            refetch();
          }}
          onClose={() => setInputModal(null)}
        />
      )}

      {historyModal && (
        <WaterUsageHistoryModal
          customer={historyModal}
          onClose={() => setHistoryModal(null)}
        />
      )}
    </div>
  );
}
