import { useState } from "react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
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
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message ?? "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="sm"
      title="Input Kilometer"
      description={`${customer.prefix} ${customer.name} — ${customer.code}`}
      onClose={onClose}
      closeDisabled={isLoading}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="meter-form"
            size="sm"
            icon="bi-check-lg"
            loading={isLoading}
            disabled={!meterNumber}
          >
            Simpan
          </Button>
        </>
      }
    >
      <form id="meter-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <Field
          label="Angka Meter Bulan Ini"
          htmlFor="meter-number"
          hint="Isi dengan angka yang tertera di meteran air."
        >
          <Input
            id="meter-number"
            type="number"
            className="form-control-lg text-center fw-bold"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
            placeholder="0"
            min={0}
            autoFocus
            required
          />
        </Field>
      </form>
    </Modal>
  );
}
