import { useEffect, useState } from "react";
import { dashboardService, type DashboardSummary } from "../services/dashboard.service";

export function useDashboard () {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch {
        setError('Failed load summaries on dashboard')
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, []) // [] => fetch sekali saat component di mount

  return { summary, isLoading, error}
}