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
