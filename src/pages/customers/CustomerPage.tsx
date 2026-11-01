import { useState } from "react";
import { useCustomer } from "../../hooks/useCustomer";
import { useVillage } from "../../hooks/useVillage";
import { useAuthStore } from "../../stores/auth.store";
import type { Customer } from "../../types";
import SearchInput from "../../components/ui/SearchInput";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import PageHeader from "../../components/ui/PageHeader";
import CustomerFormModal from "./CustomerFormModal";

type StatusTab = "0" | "1";

const TABS: { key: StatusTab; label: string; icon: string }[] = [
  { key: "0", label: "Aktif", icon: "bi-person-check" },
  { key: "1", label: "Non Aktif", icon: "bi-person-x" },
];

export default function CustomerPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.level == "0";

  const [activeTab, setActiveTab] = useState<StatusTab>("0");

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
  } = useCustomer({ status: activeTab });
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
      <PageHeader
        title="Pelanggan"
        description={`${totalData} ${
          activeTab === "0" ? "Pelanggan Aktif" : "Pelanggan Non Aktif"
        }`}
        actions={
          isAdmin && activeTab === "0" ? (
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <i className="bi bi-plus-lg" aria-hidden="true" /> Tambah
            </button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {TABS.map((t) => (
          <li key={t.key} className="nav-item">
            <button
              className={`nav-link ${activeTab === t.key ? "active fw-semibold" : "text-muted"}`}
              style={
                activeTab === t.key
                  ? {
                      color: "var(--cs-primary)",
                      borderBottomColor: "var(--cs-primary)",
                    }
                  : {}
              }
              onClick={() => setActiveTab(t.key)}
            >
              <i className={`bi ${t.icon} me-1`} />
              {t.label}
            </button>
          </li>
        ))}
      </ul>

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
          <TableSkeleton rows={8} cols={isAdmin ? 5 : 4} />
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
                    <th>Prefix</th>
                    <th>Nama</th>
                    <th>Wilayah</th>
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
                      <td>{c.prefix?.prefix}</td>
                      <td>
                        <p className="mb-0 fw-semibold small">{c.name}</p>
                      </td>
                      <td>
                        <span className="small text-muted">
                          {c.village?.name ?? ""}
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
          key={selectedCustomer?.id ?? "new"}
          customer={selectedCustomer}
          villages={villages}
          onSaved={handleSaved}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
