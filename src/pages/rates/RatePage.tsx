import { useState, useEffect } from "react";
import { rateService, type Rate } from "../../services/rate.service";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { getApiErrorMessage } from "../../utils";

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [current, setCurrent] = useState<Rate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const [all, cur] = await Promise.all([
        rateService.getAll(),
        rateService.getCurrent(),
      ]);
      setRates(all);
      setCurrent(cur);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([rateService.getAll(), rateService.getCurrent()])
      .then(([all, cur]) => {
        if (cancelled) return;
        setRates(all);
        setCurrent(cur);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      await rateService.create({
        price_per_m3: Number(price),
        effective_from: date,
      });
      setShowForm(false);
      setPrice("");
      fetchRates();
    } catch (err) {
      setError(getApiErrorMessage(err, "Gagal menyimpan tarif"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Tarif"
        description="Riwayat perubahan tarif air"
        actions={
          <Button
            size="sm"
            icon="bi-plus-lg"
            onClick={() => setShowForm(!showForm)}
          >
            Set Tarif Baru
          </Button>
        }
      />

      {/* Current rate highlight */}
      {current && (
        <div
          className="cs-card cs-card-padded mb-4 border-0"
          style={{
            background:
              "linear-gradient(135deg, var(--cs-primary) 0%, var(--cs-primary-light) 100%)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-white opacity-75 small mb-1">
                Tarif Berlaku Sekarang
              </p>
              <h3 className="fw-bold text-white mb-0">
                {formatRupiah(Number(current.pricePerM3))}
                <span className="fs-6 fw-normal ms-1">/m³</span>
              </h3>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 56,
                height: 56,
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <i className="bi bi-droplet-fill text-white fs-4" />
            </div>
          </div>
          <p className="text-white opacity-75 small mb-0 mt-2">
            <i className="bi bi-calendar me-1" />
            Berlaku sejak{" "}
            {new Date(current.effectiveFrom).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Form set tarif baru */}
      {showForm && (
        <Card className="mb-4">
          <p className="fw-semibold mb-3">Set Tarif Baru</p>
          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <Field label="Harga per m³ (Rp)" htmlFor="rate-price" required>
                  <Input
                    id="rate-price"
                    type="number"
                    className="form-control-sm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1000"
                    min={1}
                    required
                  />
                </Field>
              </div>
              <div className="col-md-5">
                <Field
                  label="Berlaku Mulai"
                  htmlFor="rate-effective-from"
                  required
                >
                  <Input
                    id="rate-effective-from"
                    type="date"
                    className="form-control-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Field>
              </div>
              <div className="col-md-2 d-flex align-items-end gap-2">
                <Button
                  type="submit"
                  size="sm"
                  block
                  loading={isSaving}
                >
                  Simpan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="bi-x"
                  aria-label="Tutup form"
                  onClick={() => setShowForm(false)}
                />
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* History */}
      <div className="list-card">
        <p className="list-card-title mb-3">History Perubahan Tarif</p>
        {isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : rates.length === 0 ? (
          <EmptyState message="Belum ada tarif tersimpan" icons="bi-tag" />
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Harga per m³</th>
                  <th>Berlaku Mulai</th>
                  <th>Ditambahkan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">
                      {formatRupiah(Number(r.pricePerM3))}
                    </td>
                    <td className="small">
                      {new Date(r.effectiveFrom).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="small text-muted">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {current?.id === r.id ? (
                        <Badge tone="success" dot>
                          Aktif
                        </Badge>
                      ) : (
                        <Badge>Tidak aktif</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
