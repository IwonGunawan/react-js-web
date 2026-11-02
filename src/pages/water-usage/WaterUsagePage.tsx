import { useState } from "react";
import { useWaterUsage } from "../../hooks/useWaterUsage";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useVillage } from "../../hooks/useVillage";
import type { WaterUsageCustomer } from "../../services/water-usage.service";
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

      {/* Summary */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Badge tone="success" dot>
          {checkedCount} sudah dicek
        </Badge>
        <Badge tone="warning" dot>
          {uncheckedCount} belum dicek
        </Badge>
      </div>

      <div className="list-card">
        <div className="list-card-toolbar">
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

        {isLoading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
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
                        <Badge>{c.code}</Badge>
                      </td>
                      <td>
                        {c.isChecked === 1 ? (
                          <Badge tone="success" dot>
                            Sudah dicek
                          </Badge>
                        ) : (
                          <Badge tone="warning" dot>
                            Belum dicek
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        {c.isChecked === 0 && (
                          <Button
                            size="sm"
                            icon="bi-pencil-square"
                            className="me-1"
                            onClick={() => setInputModal(c)}
                          >
                            Input
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="bi-clock-history"
                          title="History pemakaian"
                          aria-label={`History pemakaian ${c.name}`}
                          onClick={() => setHistoryModal(c)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="list-card-footer">
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
