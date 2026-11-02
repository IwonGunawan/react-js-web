import { useState } from "react";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { userService, type AppUser } from "../../services/user.service";

interface Props {
  user: AppUser | null;
  onSaved: () => void;
  onClose: () => void;
}

export default function UserFormModal({ user, onSaved, onClose }: Props) {
  const isEdit = user !== null;

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    level: user?.level ?? ("1" as "0" | "1"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isEdit && user) {
        await userService.update(user.id, {
          name: form.name,
          email: form.email,
          level: form.level,
        });
      } else {
        await userService.create({
          name: form.name,
          email: form.email,
          password: form.password,
          level: form.level,
        });
      }
      onSaved();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message ?? "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="sm"
      title={isEdit ? "Edit Petugas" : "Tambah Petugas"}
      description={
        isEdit ? "Perbarui data akun petugas." : "Buat akun petugas baru."
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
            form="user-form"
            size="sm"
            icon="bi-check-lg"
            loading={isLoading}
          >
            {isEdit ? "Simpan" : "Tambah"}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <Field label="Nama" htmlFor="user-name" required className="mb-3">
          <Input
            id="user-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Email" htmlFor="user-email" required className="mb-3">
          <Input
            id="user-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Field>

        {!isEdit && (
          <Field
            label="Password"
            htmlFor="user-password"
            hint="Minimal 6 karakter."
            required
            className="mb-3"
          >
            <Input
              id="user-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
              placeholder="Min. 6 karakter"
            />
          </Field>
        )}

        <Field label="Role" htmlFor="user-level">
          <select
            id="user-level"
            name="level"
            className="form-select"
            value={form.level}
            onChange={handleChange}
          >
            <option value="1">Operator</option>
            <option value="0">Admin</option>
          </select>
        </Field>
      </form>
    </Modal>
  );
}
