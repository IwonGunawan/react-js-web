import type { Customer, PaginatedResponse } from "../types";
import api from "./api";

interface QueryCustomer {
  village_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateCustomer {
  prefix_id: number;
  name: string;
  address: string;
  village_id: number;
}



export const customerService = {
  getAll: (params?: QueryCustomer) => 
    api.get<PaginatedResponse<Customer>>('/customers', {params}).then(r => r.data),
  
  getOne: (id: number) => 
    api.get(`customers/${id}`).then(r => r.data),
  
  create: (payload: CreateCustomer) => 
    api.post<Customer>('/customers', payload).then(r => r.data),

  update: (id: number, payload: Partial<CreateCustomer>) => 
    api.put<Customer>(`/customers/${id}`, payload).then(r => r.data),

  delete: (id:number) => 
    api.delete<Customer>(`/customers/${id}`).then(r => r.data),
}