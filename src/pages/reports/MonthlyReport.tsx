import { useState, useEffect } from "react";
import {
  reportService,
  type MonthlyReportItem,
} from "../../services/report.service";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useVillage } from "../../hooks/useVillage";

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface Props {
  month: number;
  year: number;
}

export default function MonthlyReport({ month, year }: Props) {
  const { villages } = useVillage();

  const [data, setData] = useState<MonthlyReportItem[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [villageId, setVillageId] = useState<number | undefined>();

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [month, year, search, villageId]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await reportService.getMonthly({
          month,
          year,
          page,
          search: search || undefined,
          villageId,
        });
        setData(res.data);
        setTotalPages(res.meta.totalPages);
        if (res.summary) setSummary(res.summary);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [month, year, page, search, villageId]);

  return (
    <div>
      {/* Summary cards */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <Card>
            <p className="text-muted small mb-1">Total Pemasukan</p>
            <h5 className="fw-bold mb-0" style={{ color: "var(--cs-primary)" }}>
              {formatRupiah(summary.totalIncome)}
            </h5>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <p className="text-muted small mb-1">Jumlah Transaksi</p>
            <h5 className="fw-bold mb-0">{summary.totalTransactions}</h5>
          </Card>
        </div>
      </div>

      <div className="list-card">
        <div className="list-card-toolbar">
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

        {isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : data.length === 0 ? (
          <EmptyState message="Tidak ada data pembayaran" icons="bi-receipt" />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Wilayah</th>
                    <th className="text-end">Tagihan</th>
                    <th className="text-end">Tunai</th>
                    <th>Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.paymentId}>
                      <td>
                        <p className="mb-0 small">
                          {new Date(row.paidDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.72rem" }}
                        >
                          {new Date(row.paidDate).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 small fw-semibold">
                          {row.prefix} {row.customerName}
                        </p>
                        <Badge>{row.customerCode}</Badge>
                      </td>
                      <td>
                        <span className="small text-muted">{row.village}</span>
                      </td>
                      <td className="text-end small fw-semibold">
                        {formatRupiah(row.total)}
                      </td>
                      <td className="text-end small">
                        {formatRupiah(row.cash)}
                      </td>
                      <td>
                        <span className="small text-muted">{row.officer}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="list-card-footer">
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
