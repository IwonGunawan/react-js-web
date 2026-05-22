export interface User {
  id: number;
  name: string;
  email: string;
  status: '0' | '1'; // active inactive
  level: '0' | '1'; // admin petugas
}

export interface Customer {
  id:        number;
  uuid:      string;
  code:      string;
  prefixId:  number;
  name:      string;
  address:   string;
  villageId: number;
  deleted:   string;
  village?:  Village;
  prefix?:   CustomerPrefix;
}

export interface Village {
  id:   number;
  name: string;
  status: number;
}

export interface CustomerPrefix {
  id:     number;
  prefix: string;
}

export interface WaterUsage {
  id:          number;
  uuid:        string;
  customerId:  number;
  year:        number;
  month:       number;
  rateId:      number;
  meterNumber: number;
  meterUsage:  number;
  status:      '0' | '1' | '2' | '3'; // 0:belum/baru_dicek, 1:lunas, 2:kurang-bayar, 3:lebih-bayar
  lastUsed:    '0' | '1'; // 0;default, 1:terakhir dipakai
}

export interface Payment {
  id:         number;
  customerId: number;
  total:      number;
  cash:       number;
  logUuid:    string;
  createdAt:  string;
}

export interface BillDetail {
  customerId:        number;
  listBill:          ListBill[];
  underpayment:      number;
  overpayment:       number;
  billTotal:         number;
  finalTotal:        number;
}

export interface ListBill { 
  waterUsageId:     number; 
  month:            number; 
  year:             number; 
  meterUsage:       number 
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total:       number; // total data
    page:        number; // current page
    limit:       number; // limit per page
    totalPages: number; // total page
  };
}