/**
 * Mengambil pesan error yang ramah pengguna dari error Axios / unknown.
 *
 * Backend NestJS mengirim error dengan bentuk:
 * - UnauthorizedException('Password salah')    -> response.data.message: string
 * - ValidationPipe (class-validator) gagal      -> response.data.message: string[]
 * - HttpException(message)                      -> response.data.message: string
 * - axios network error / tidak ada response    -> undefined
 *
 * Helper ini menormalkan semuanya jadi string tunggal.
 */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
): string {
  if (!err || typeof err !== "object") return fallback;

  const anyErr = err as {
    response?: { data?: { message?: unknown } };
    message?: string;
  };

  const raw = anyErr.response?.data?.message;

  if (Array.isArray(raw)) {
    const first = raw.find((m) => typeof m === "string" && m.trim().length > 0);
    if (first) return first;
  } else if (typeof raw === "string" && raw.trim().length > 0) {
    return raw;
  }

  if (typeof anyErr.message === "string" && anyErr.message.trim().length > 0) {
    return anyErr.message;
  }

  return fallback;
}

export const formatRupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');

export const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];


export const PREFIXES = [
  {
    id: 1,
    label: 'Bpk'
  },
  {
    id: 2,
    label: 'Ibu',
  },
  {
    id: 3,
    label: 'AKi'
  },
  {
    id: 4,
    label: 'Ma'
  }
]

export const STATUS_MAP: Record<string, { label: string; className: string }> = {
  '0': { label: 'Belum Bayar',  className: 'badge-status-belum' },
  '1': { label: 'Lunas',        className: 'badge-status-lunas' },
  '2': { label: 'Kurang Bayar', className: 'badge-status-kurang' },
  '3': { label: 'Lebih Bayar',  className: 'badge-status-lebih' },
};

/**
 * convert number with dot. ex: 50000 -> 50.000
 * @param value number
 * @returns 50.000
 */
export const formatNumberInput = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  return numeric ? Number(numeric).toLocaleString("id-ID") : "";
};

/**
 * back again to type number. ex: 50.000 -> 50000
 * @param value number
 * @returns 50000
 */
export const parseNumberInput = (value: string) => {
  return value.replace(/\./g, "");
};
