import api from "./api";

export interface DashboardSummary {
  thisMonth: {
    month: number;
    year: number;
  };
  incomeThisMonth: number;
  paidCount: number;
  unpaidCount: number;
  incomeChart: IncomeChart[];
  topArrears: {
    customerId: number;
    name: string;
    code: string;
    arrearsAmount: number;
  }[];
}

export interface IncomeChart {
  month: number;
  year: number;
  total: number;
}

export const dashboardService = {
  getSummary: () => 
    api.get<DashboardSummary>('/dashboard/summary').then(r => r.data),
}