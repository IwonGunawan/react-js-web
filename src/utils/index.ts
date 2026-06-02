export const formatRupiah = (n: number) => 'Rp.' + n.toLocaleString('id-ID');

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