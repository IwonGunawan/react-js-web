import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import type { Customer, Village } from "../../types";
import { customerService } from "../../services/customer.service";
import { PREFIXES } from "../../utils";

interface Props {
  customer: Customer | null; // for create action
  villages: Village[];
  onSaved: () => void;
  onClose: () => void;
}

export default function CustomerFormModal({
  customer,
  villages,
  onSaved,
  onClose,
}: Props) {
  const isEdit = customer !== null;

  const [form, setFrom] = useState({
    prefix_id: customer?.prefixId ?? 1,
    name: customer?.name ?? "",
    address: customer?.address ?? "",
    village_id: customer?.villageId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFrom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const customerId = Number(customer?.id);

    try {
      if (isEdit && customer) {
        await customerService.update(customerId, {
          ...form,
          prefix_id: Number(form.prefix_id),
          village_id: Number(form.village_id),
        });
      } else {
        await customerService.create({
          ...form,
          prefix_id: Number(form.prefix_id),
          village_id: Number(form.village_id),
        });
      }
      onSaved();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message ?? "Gagal menyimpan data pelanggan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Pelanggan" : "Tambah Pelanggan"}
      description={
        isEdit
          ? "Perbarui data pelanggan."
          : "Lengkapi data pelanggan baru."
      }
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
            form="customer-form"
            size="sm"
            icon="bi-check-lg"
            loading={isLoading}
          >
            {isEdit ? "Simpan" : "Tambah"}
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <Field label="Prefix" htmlFor="customer-prefix" required>
              <select
                id="customer-prefix"
                name="prefix_id"
                className="form-select"
                value={form.prefix_id}
                onChange={handleChange}
                required
              >
                {PREFIXES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="col-12 col-sm-6">
            <Field label="Area" htmlFor="customer-village" required>
              <select
                id="customer-village"
                name="village_id"
                className="form-select"
                value={form.village_id}
                onChange={handleChange}
                required
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="col-12">
            <Field label="Nama Lengkap" htmlFor="customer-name" required>
              <input
                id="customer-name"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Field>
          </div>

          <div className="col-12">
            <Field label="Alamat" htmlFor="customer-address">
              <textarea
                id="customer-address"
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
            </Field>
          </div>
        </div>
      </form>
    </Modal>
  );
}
