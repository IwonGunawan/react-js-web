import { useState } from "react";
import {
  waterUsageService,
  type WaterUsageCustomer,
} from "../../services/water-usage.service";

interface Props {
  customer: WaterUsageCustomer;
  onSaved: () => void;
  onClose: () => void;
}

export default function InputMeterModal({ customer, onSaved, onClose }: Props) {
  const [meterNumber, setMeterNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterNumber) return;
    setError(null);
    setIsLoading(true);

    try {
      await waterUsageService.create({
        customerId: customer.customerId,
        meterNumber: Number(meterNumber),
      });
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h6 className="modal-title fw-bold mb-0">Input Kilometer</h6>
              <p className="text-muted small mb-0">
                {customer.prefix} {customer.name} — {customer.code}
              </p>
            </div>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              <label className="form-label small fw-semibold">
                Angka Meter Bulan Ini
              </label>
              <input
                type="number"
                className="form-control form-control-lg text-center"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="0"
                min={0}
                autoFocus
                required
              />
              <p className="text-muted small mt-1 mb-0">
                Isi dengan angka yang tertera di meteran air
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={isLoading || !meterNumber}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
