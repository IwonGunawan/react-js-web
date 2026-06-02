import { useEffect, useState } from "react";
import type { Village } from "../types";
import { villageService } from "../services/village.service";

export function useVillage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await villageService.getAll()
        setVillages(data)
      } catch {
        setError('Failed load villages data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []) // [] => load sekali saat di mount

  return {
    villages,
    isLoading, 
    error
  }
}