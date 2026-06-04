import type { PaginatedResponse } from '../types';
import api from './api';
import type { WaterUsageQuery } from './water-usage.service';


export interface PaymentCustomer {
  customerId: number;
  code:       string;
  name:       string;
  prefix:     string;
  isChecked:  number; // 1 = sudah, 0 = belum
  finalTotal: number;
}

export interface BillDetail {
  customerId: number;
  waterUsages: WaterUsagePrice[];
  underpayment: number;
  overpayment: number;
  billTotal: number;
  finalTotal: number;
}

interface WaterUsagePrice {
  waterUsageId: number;
  month: number;
  year: number;
  meterUsage: number;
  status: string; // 0: baru, 1: lunas, 2: kurang bayar, 3: lebih bayar
  totalPrice: number;
}

export interface PaymentHistory {
  id:         number;
  total:      number;
  cash:       number;
  logUuid:    string;
  createdAt:  string;
  paymentDetails: PaymentDetail[];
}

interface PaymentDetail {
  id: number;
  paymentId: number;
  waterUsageId: number;
}

export const paymentService = {
  getAll: (params?: WaterUsageQuery) =>
    api.get<PaginatedResponse<PaymentCustomer>>('/payments', { params })
       .then(r => r.data),

  getBill: (customerId: number) =>
    api.get<BillDetail>('/payments/bill', { params: { customerId } })
       .then(r => r.data),

  create: (payload: {
    customerId: number;
    cash: number;
    saveChange: boolean;
  }) => api.post('/payments', payload).then(r => r.data),

  getByCustomer: (customerId: number, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<PaymentHistory>>(
      `/payments/customer/${customerId}`,
      { params },
    ).then(r => r.data),
};