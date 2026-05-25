import { useEffect, useState } from "react";
import type { Village } from "../types";
import { villageService } from "../services/village.service";

export function useVillage() {
  const [village, setVillage] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await villageService.getAll()
        setVillage(data)
      } catch {
        setError('Failed load village data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []) // [] => load sekali saat di mount

  return {
    village,
    isLoading, 
    error
  }
}