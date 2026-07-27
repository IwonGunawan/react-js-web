import { useCallback, useEffect, useMemo, useState } from "react";
import type { Customer } from "../types";
import { customerService } from "../services/customer.service";

interface InitialQuery {
  village_id?: number;
  page?: number;
  limit?: number;
  search?: string;
  /** '0' = aktif, '1' = non-aktif */
  status?: "0" | "1";
}

export function useCustomer(initialQuery: InitialQuery = {}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<Omit<InitialQuery, "status">>({
    village_id: initialQuery.village_id,
    page: initialQuery.page,
    limit: initialQuery.limit,
    search: initialQuery.search,
  });

  const status = initialQuery.status;
  const query = useMemo<InitialQuery>(
    () => ({ ...filters, status }),
    [filters, status],
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rest = await customerService.getAll(query);
      setCustomers(rest.data);
      setTotalData(rest.meta.totalData);
      setTotalPages(rest.meta.totalPages);
    } catch (error) {
      console.log({ error });
      setError("Failed load customer data");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Saat user ganti tab, paginasi tiap tab mulai dari halaman 1.
  // Pola ini mengikuti konvensi yang sudah dipakai di file ini (lihat fetchData di bawah).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  }, [status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const updateQuery = (updates: Partial<Omit<InitialQuery, "status">>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    customers,
    isLoading,
    error,
    totalPages,
    totalData,
    query,
    updateQuery,
    setPage,
    refetch: fetchData,
  };
}
