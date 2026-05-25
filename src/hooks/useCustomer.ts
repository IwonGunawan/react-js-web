import { useCallback, useEffect, useState } from "react";
import type { Customer } from "../types";
import { customerService } from "../services/customer.service";

interface InitialQuery {
  village_id? : number;
  page?: number;
  limit?: number;
  search?: string;
}

export function useCustomer(initialQuery: InitialQuery = {}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState<InitialQuery>({ page: 1, ...initialQuery});

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rest = await customerService.getAll(query);
      setCustomers(rest.data);
      setTotalData(rest.meta.total);
      setTotalPages(rest.meta.totalPages);
    } catch (error) {
      console.log({error})
      setError('Failed load customer data')
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // running ulang setiap kali query berubah
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData() }, [fetchData]);

  const updateQuery = (updates: Partial<InitialQuery>) => {
    setQuery((prev) => ({...prev, ...updates, page: 1}));
  }

  const setPage = (page: number) => {
    setQuery((prev) => ({...prev, page}))
  }

  return {
    customers,
    isLoading,
    error,
    totalPages, 
    totalData, 
    initialQuery, 
    updateQuery,
    setPage, 
    refetch: fetchData,
  };

}