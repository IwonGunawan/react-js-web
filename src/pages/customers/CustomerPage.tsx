import { useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";
import { useVillage } from "../../hooks/useVillage";
import { useAuthStore } from "../../stores/auth.store";
import type { Customer } from "../../types";
import SearchInput from "../../components/ui/SearchInput";
import { Spinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import CustomerFormModal from "./CustomerFormModal";

export default function CustomerPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.level == "0";

  const {
    customers,
    isLoading,
    error,
    totalData,
    totalPages,
    query,
    updateQuery,
    setPage,
    refetch,
  } = useCustomer();
  const { villages } = useVillage();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // call action
  const openCreate = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setSelectedCustomer(c);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaved = () => {
    closeModal();
    refetch();
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-item-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Pelanggan</h5>
          <p className="text-muted small mb-0">{totalData} Total Pelanggan</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary btn-sm pe-3" onClick={openCreate}>
            <i className="bi bi-plus-lg me-1" /> Tambah
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="stat-card mb-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <SearchInput
            placeholder="Cari nama atau code"
            onSearch={(v) => updateQuery({ search: v })}
          />

          <select
            className="form-select form-select-sm"
            style={{ width: 160 }}
            value={query.village_id ?? ""}
            onChange={(e) => {
              const villageId = e.target.value
                ? Number(e.target.value)
                : undefined;
              console.log({ villageId });
              updateQuery({ village_id: villageId });
            }}
          >
            <option value="">Semua Desa</option>
            {villages.map((v) => (
              <option key={v.id} value={Number(v.id)}>
                {v.name}
              </option>
            ))}
          </select>
          {/* <select className="form-select form-select-sm" style={{ width: 160 }}>
            <option value="name-ASC">Nama A-Z</option>
            <option value="name-DESC">Nama Z-A</option>
            <option value="id-ASC">ID Terlama</option>
            <option value="id-DESC">ID Terbaru</option>
          </select> */}
        </div>
      </div>

      {/* Table  */}
      <div className="stat-card">
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : customers.length == 0 ? (
          <EmptyState message="Pelanggan tidak ditemukan" />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-midle mb-0">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Wilayah</th>
                    <th>Status</th>
                    {isAdmin && <th className="text-end">action</th>}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span className="badge bg-light text-dark fw-normal">
                          {c.code}
                        </span>
                      </td>
                      <td>
                        <p className="mb-0 fw-semibold small">{c.name}</p>
                      </td>
                      <td>
                        <span className="small text-muted">
                          {c.village?.name ?? ""}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${c.deleted == "0" ? "badge-status-lunas" : "badge-status-kurang"}`}
                        >
                          {c.deleted == "0" ? "Aktif" : "InActive"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="text-muted text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() => openEdit(c)}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

      {/* Modal Customer */}
      {modalOpen && (
        <CustomerFormModal
          customer={selectedCustomer}
          villages={villages}
          onSaved={handleSaved}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
