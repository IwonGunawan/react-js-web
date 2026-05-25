import type { Village } from "../types";
import api from "./api";


export const villageService = {
  getAll: () => 
    api.get<Village[]>('/villages').then(r => r.data),
}