import { useState, useEffect, useCallback } from 'react';
import { waterUsageService, type WaterUsageCustomer, type WaterUsageHistory } from '../services/water-usage.service';

interface Query {
  village_id?:  number;
  search?:      string;
  page?:        number;
  sort_by?:     'name' | 'id';
  sort_order?:  'ASC' | 'DESC';
}

export function useWaterUsage(initialQuery: Query = {}) {
  const [data,        setData]        = useState<WaterUsageCustomer[]>([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalItems,  setTotalItems]  = useState(0);
  const [query,       setQuery]       = useState<Query>({ page: 1, ...initialQuery });

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await waterUsageService.getAll(query);
      setData(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalItems(res.meta.totalData);
    } catch {
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // running ulang setiap kali query berubah
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch(); }, [fetch]);

  const updateQuery = (updates: Partial<Query>) =>
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));

  const setPage = (page: number) =>
    setQuery((prev) => ({ ...prev, page }));

  return { data, isLoading, error, totalPages, totalItems, query, updateQuery, setPage, refetch: fetch };
}

export function useWaterUsageHistory(customerId: number) {
  const [history,   setHistory]   = useState<WaterUsageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!customerId) return;
    setIsLoading(true);
    try {
      const res = await waterUsageService.getByCustomer(customerId);
      setHistory(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch(); }, [fetch]);

  return { history, isLoading, refetch: fetch };
}