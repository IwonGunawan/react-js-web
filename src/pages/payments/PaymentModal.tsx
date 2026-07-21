import { useState, useEffect } from "react";
import {
  paymentService,
  type BillDetail,
} from "../../services/payment.service";
import type { WaterUsageCustomer } from "../../services/water-usage.service";
import { Spinner } from "../../components/ui/Spinner";
import {
  formatNumberInput,
  formatRupiah,
  MONTH_NAMES,
  parseNumberInput,
} from "../../utils";

interface Props {
  customer: WaterUsageCustomer;
  onSaved: () => void;
  onClose: () => void;
}

type Step = "bill" | "confirm" | "receipt";

interface Receipt {
  refNumber: string;
  paidDate: string;
  total: number;
  cash: number;
  change: number;
  monthTotal: number;
  textInfo: string;
}

export default function PaymentModal({ customer, onSaved, onClose }: Props) {
  const [step, setStep] = useState<Step>("bill");
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cash, setCash] = useState("");
  const [saveChange, setSaveChange] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Fetch bill saat modal buka
  useEffect(() => {
    const fetchBill = async () => {
      setIsLoading(true);
      try {
        const data = await paymentService.getBill(customer.customerId);
        setBill(data);
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Gagal memuat tagihan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBill();
  }, [customer.customerId]);

  const cashAmount = Number(parseNumberInput(cash)) || 0;
  const change = bill ? cashAmount - bill.finalTotal : 0;
  const isShortPay = change < 0;
  const isOverPay = change > 0;

  const handlePay = async () => {
    if (!bill) return;
    setIsPaying(true);
    setError(null);
    try {
      const result = await paymentService.create({
        customerId: customer.customerId,
        cash: cashAmount,
        saveChange: saveChange,
      });
      setReceipt(result);
      setStep("receipt");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Pembayaran gagal");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCashChange = (value: string) => {
    setCash(formatNumberInput(value));
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h6 className="modal-title fw-bold mb-0">Bayar Air</h6>
              <p className="text-muted small mb-0">
                {customer.prefix} {customer.name} — {customer.code}
              </p>
            </div>
            {step === "receipt" ? (
              <button className="btn-close" onClick={onSaved} />
            ) : (
              <button
                className="btn-close"
                onClick={onClose}
                disabled={isPaying}
              />
            )}
          </div>

          {/* Body */}
          <div className="modal-body">
            {isLoading ? (
              <Spinner />
            ) : error && step !== "receipt" ? (
              <div className="alert alert-danger small">{error}</div>
            ) : step === "bill" || step === "confirm" ? (
              bill && (
                <BillStep
                  bill={bill}
                  cash={cash}
                  setCash={handleCashChange}
                  saveChange={saveChange}
                  setSaveChange={setSaveChange}
                  change={change}
                  isShortPay={isShortPay}
                  isOverPay={isOverPay}
                />
              )
            ) : receipt ? (
              <ReceiptStep receipt={receipt} customer={customer} />
            ) : null}
          </div>

          {/* Footer */}
          {!isLoading && step !== "receipt" && bill && (
            <div className="modal-footer">
              <button
                className="btn btn-sm btn-light"
                onClick={onClose}
                disabled={isPaying}
              >
                Batal
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handlePay}
                disabled={isPaying || cashAmount <= 0}
              >
                {isPaying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1" />
                    Proses Pembayaran
                  </>
                )}
              </button>
            </div>
          )}

          {step === "receipt" && (
            <div className="modal-footer">
              <button className="btn btn-sm btn-primary" onClick={onSaved}>
                <i className="bi bi-check-lg me-1" />
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bill Step ─────────────────────────────────────────────────────

function BillStep({
  bill,
  cash,
  setCash,
  saveChange,
  setSaveChange,
  change,
  isShortPay,
  isOverPay,
}: {
  bill: BillDetail;
  cash: string;
  setCash: (v: string) => void;
  saveChange: boolean;
  setSaveChange: (v: boolean) => void;
  change: number;
  isShortPay: boolean;
  isOverPay: boolean;
}) {
  return (
    <div>
      {/* Detail tagihan */}
      <div className="table-responsive mb-3">
        <table className="table table-sm mb-0">
          <tbody>
            {bill.waterUsages.map(
              (b) =>
                b.status == "0" && (
                  <tr key={b.waterUsageId}>
                    <td className="small text-muted">
                      Tagihan {MONTH_NAMES[b.month]} ({b.meterUsage}m³)
                    </td>
                    <td className="small text-end">
                      {formatRupiah(b.totalPrice)}
                    </td>
                  </tr>
                ),
            )}
            {bill.underpayment > 0 && (
              <tr>
                <td className="small text-muted">Kurang bayar sebelumnya</td>
                <td className="small text-end text-danger">
                  {formatRupiah(bill.underpayment)}
                </td>
              </tr>
            )}
            {bill.overpayment > 0 && (
              <tr>
                <td className="small text-muted">Lebih bayar sebelumnya</td>
                <td className="small text-end text-success">
                  -{formatRupiah(bill.overpayment)}
                </td>
              </tr>
            )}
            <tr className="table-light">
              <td className="small fw-bold">Total yang harus dibayar</td>
              <td
                className="fw-bold text-end"
                style={{ color: "var(--cs-primary)" }}
              >
                {formatRupiah(bill.finalTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Input cash */}
      <div className="mb-3">
        <label className="form-label small fw-semibold">Uang Tunai</label>
        <input
          type="number"
          className="form-control text-center fw-bold"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          placeholder="0"
          min={0}
          autoFocus
        />
      </div>

      {/* Kembalian */}
      {Number(cash.replace(/\./g, "")) > 0 && (
        <div
          className={`rounded p-3 mb-3 ${
            isShortPay
              ? "bg-danger bg-opacity-10 border border-danger border-opacity-25"
              : "bg-success bg-opacity-10 border border-success border-opacity-25"
          }`}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="small fw-semibold">
              {isShortPay ? "Kurang bayar" : "Kembalian"}
            </span>
            <span
              className={`fw-bold ${isShortPay ? "text-danger" : "text-success"}`}
            >
              {formatRupiah(Math.abs(change))}
            </span>
          </div>
        </div>
      )}

      {/* Simpan kembalian */}
      {isOverPay && (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="save-change"
            checked={saveChange}
            onChange={(e) => setSaveChange(e.target.checked)}
          />
          <label className="form-check-label small" htmlFor="save-change">
            Simpan kembalian untuk bulan depan
          </label>
        </div>
      )}
    </div>
  );
}

// ─── Receipt Step ──────────────────────────────────────────────────

function ReceiptStep({
  receipt,
  customer,
}: {
  receipt: Receipt;
  customer: WaterUsageCustomer;
}) {
  return (
    <div className="text-center">
      {/* Icon status */}
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: 64, height: 64, background: "var(--cs-primary-soft)" }}
      >
        <i
          className="bi bi-check-lg fs-3"
          style={{ color: "var(--cs-primary)" }}
        />
      </div>

      <p className="fw-bold mb-1">Pembayaran Berhasil</p>
      <p className="text-muted small mb-4">{receipt.textInfo}</p>

      {/* Struk */}
      <div
        className="text-start border rounded p-3"
        style={{
          fontFamily: "monospace",
          fontSize: "0.82rem",
          background: "var(--cs-neutral-soft)",
        }}
      >
        <p className="text-center fw-bold mb-1">STRUK PEMBAYARAN AIR</p>
        <p
          className="text-center text-muted mb-3"
          style={{ fontSize: "0.75rem" }}
        >
          CIKARET SETRA
        </p>
        <div className="d-flex justify-content-between">
          <span>No. Ref</span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            {receipt.refNumber.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Pelanggan</span>
          <span>
            {customer.prefix} {customer.name}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Tgl Bayar</span>
          <span>{new Date(receipt.paidDate).toLocaleDateString("id-ID")}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Jml Bulan</span>
          <span>{receipt.monthTotal} bulan</span>
        </div>
        <hr className="my-2" />
        <div className="d-flex justify-content-between">
          <span>Tagihan</span>
          <span>{formatRupiah(receipt.total)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Tunai</span>
          <span>{formatRupiah(receipt.cash)}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold">
          <span>Kembalian</span>
          <span>{formatRupiah(receipt.change)}</span>
        </div>
        <hr className="my-2" />
        <p
          className="text-center text-muted mb-0"
          style={{ fontSize: "0.75rem" }}
        >
          {receipt.textInfo}
        </p>
      </div>
    </div>
  );
}
