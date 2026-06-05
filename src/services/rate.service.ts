import api from './api';

export interface Rate {
  id:           number;
  pricePerM3:   number;
  effectiveFrom: string;
  createdAt:    string;
}

export const rateService = {
  getAll: () =>
    api.get<Rate[]>('/rates').then(r => r.data),

  getCurrent: () =>
    api.get<Rate>('/rates/current').then(r => r.data),

  create: (payload: { price_per_m3: number; effective_from: string }) =>
    api.post<Rate>('/rates', payload).then(r => r.data),
};