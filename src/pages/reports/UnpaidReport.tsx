import { useState, useEffect } from "react";
import {
  reportService,
  type UnpaidReportItem,
} from "../../services/report.service";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { useVillage } from "../../hooks/useVillage";
import { Spinner } from "../../components/ui/Spinner";

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface Props {
  month: number;
  year: number;
}

export default function UnpaidReport({ month, year }: Props) {
  const { villages } = useVillage();

  const [data, setData] = useState<UnpaidReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [villageId, setVillageId] = useState<number | undefined>();

  useEffect(() => {
    setPage(1);
  }, [month, year, search, villageId]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await reportService.getUnpaid({
          month,
          year,
          page,
          search: search || undefined,
          villageId,
        });
        setData(res.data);
        setTotalPages(res.meta.totalPages);
        setTotal(res.meta.totalData);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [month, year, page, search, villageId]);

  const totalArrears = data.reduce(
    (s, d) => s + (d.underpaymentAmount || 0),
    0,
  );

  return (
    <div>
      {/* Summary */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="stat-card">
            <p className="text-muted small mb-1">Belum Bayar</p>
            <h5 className="fw-bold mb-0">{total} pelanggan</h5>
          </div>
        </div>
        <div className="col-md-6">
          <div className="stat-card">
            <p className="text-muted small mb-1">Total Tunggakan</p>
            <h5 className="fw-bold mb-0 text-danger">
              {formatRupiah(totalArrears)}
            </h5>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <SearchInput
          placeholder="Cari nama atau kode..."
          onSearch={setSearch}
        />
        <select
          className="form-select form-select-sm"
          style={{ width: 160 }}
          value={villageId ?? ""}
          onChange={(e) =>
            setVillageId(e.target.value ? Number(e.target.value) : undefined)
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

      {/* Table */}
      <div className="stat-card">
        {isLoading ? (
          <Spinner />
        ) : data.length === 0 ? (
          <EmptyState
            message="Semua pelanggan sudah bayar 🎉"
            icons="bi-check-circle"
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Pelanggan</th>
                    <th>Wilayah</th>
                    <th>Periode</th>
                    <th className="text-center">Pakai (m³)</th>
                    <th className="text-end">Tunggakan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.waterUsageId}>
                      <td>
                        <p className="mb-0 small fw-semibold">
                          {row.prefix} {row.customerName}
                        </p>
                        <span
                          className="badge bg-light text-dark fw-normal"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {row.customerCode}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{row.village}</span>
                      </td>
                      <td>
                        <span className="small">
                          {MONTH_NAMES[row.month]} {row.year}
                        </span>
                      </td>
                      <td className="text-center small">{row.meterUsage}</td>
                      <td className="text-end small fw-semibold text-danger">
                        {row.underpaymentAmount > 0
                          ? formatRupiah(row.underpaymentAmount)
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.status === "0"
                              ? "badge-status-belum"
                              : "badge-status-kurang"
                          }`}
                        >
                          {row.status === "0" ? "Belum Bayar" : "Kurang Bayar"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
