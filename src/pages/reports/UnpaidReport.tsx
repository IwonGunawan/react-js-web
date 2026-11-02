import { useState, useEffect } from "react";
import {
  reportService,
  type UnpaidReportItem,
} from "../../services/report.service";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useVillage } from "../../hooks/useVillage";

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
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [villageId, setVillageId] = useState<number | undefined>();

  useEffect(() => {
    let cancelled = false;
    reportService
      .getUnpaid({
        month,
        year,
        page,
        search: search || undefined,
        villageId,
      })
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setTotalPages(res.meta.totalPages);
        setTotal(res.meta.totalData);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [month, year, page, search, villageId]);

  const applySearch = (value: string) => {
    setIsLoading(true);
    setPage(1);
    setSearch(value);
  };

  const applyVillage = (value: number | undefined) => {
    setIsLoading(true);
    setPage(1);
    setVillageId(value);
  };

  const applyPage = (value: number) => {
    setIsLoading(true);
    setPage(value);
  };

  const totalArrears = data.reduce(
    (s, d) => s + (d.underpaymentAmount || 0),
    0,
  );

  return (
    <div>
      {/* Summary */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <Card>
            <p className="text-muted small mb-1">Belum Bayar</p>
            <h5 className="fw-bold mb-0">{total} pelanggan</h5>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <p className="text-muted small mb-1">Total Tunggakan</p>
            <h5 className="fw-bold mb-0 text-danger">
              {formatRupiah(totalArrears)}
            </h5>
          </Card>
        </div>
      </div>

      <div className="list-card">
        <div className="list-card-toolbar">
          <SearchInput
            placeholder="Cari nama atau kode..."
            onSearch={applySearch}
          />
          <select
            className="form-select form-select-sm"
            style={{ width: 160 }}
            value={villageId ?? ""}
            onChange={(e) =>
              applyVillage(e.target.value ? Number(e.target.value) : undefined)
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
                        <Badge>{row.customerCode}</Badge>
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
                        <Badge
                          tone={row.status === "0" ? "warning" : "danger"}
                          dot
                        >
                          {row.status === "0" ? "Belum Bayar" : "Kurang Bayar"}
                        </Badge>
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
                onChange={applyPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
