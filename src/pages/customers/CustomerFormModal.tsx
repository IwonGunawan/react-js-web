import React, { useEffect, useState } from "react";
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

  // sync form saat customer berubah (Edit mode)
  useEffect(() => {
    if (customer) {
      setFrom({
        prefix_id: customer?.prefixId,
        name: customer?.name,
        address: customer?.address,
        village_id: customer?.villageId,
      });
    }
  }, [customer]);

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
    setIsLoading(false);

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
    } catch (error) {
      console.log(error);
      setError("Failed submit data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(15, 42, 53, 0.45)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title fw-bold">
              {isEdit ? "Edit Pelanggan" : "New Pelanggan"}
            </h6>
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

              <div className="row g-3">
                {/* ROW 1 */}
                <div className="col-6">
                  <label className="form-label small fw-semibold">Prefix</label>
                  <select
                    name="prefix_id"
                    className="form-select form-select-sm"
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
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Area</label>
                  <select
                    name="village_id"
                    className="form-select form-select-sm"
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
                </div>

                {/* ROW 2 */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Nama Lengkap
                  </label>
                  <input
                    name="name"
                    className="form-control form-control-sm"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ROW 3 */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Alamat</label>
                  <textarea
                    name="address"
                    className="form-control form-control-sm"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </div>
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-1">
                    saved...
                  </span>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1" />
                    {isEdit ? "Update" : "Tambah"}
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
