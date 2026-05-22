import type { User } from "../types";
import api from "./api";

interface LoginResponse {
  access_token: string;
  user: User;
}

export const authService = {
  
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const {data} = await api.post<LoginResponse>('/auth/login', {
      email, 
      password
    })
    return data
  }
}