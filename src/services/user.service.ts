import api from './api';

export interface AppUser {
  id:          number;
  uuid:        string;
  name:        string;
  email:       string;
  level:       '0' | '1';
  status:      '0' | '1'; // 0: active, 1: non-active
  createdDate: string;
}

export interface CreateUserPayload {
  name:     string;
  email:    string;
  password: string;
  level:    '0' | '1';
}

export const userService = {
  getAll: () =>
    api.get<AppUser[]>('/users').then(r => r.data),

  create: (payload: CreateUserPayload) =>
    api.post<AppUser>('/users', payload).then(r => r.data),

  update: (id: number, payload: Partial<Omit<CreateUserPayload, 'password'>>) =>
    api.put<AppUser>(`/users/${id}`, payload).then(r => r.data),

  toggleStatus: (id: number) =>
    api.patch(`/users/${id}/status`).then(r => r.data),

  resetPassword: (id: number) =>
    api
      .patch<{ id: number; message: string; defaultPassword: string }>(
        `/users/${id}/reset-password`,
      )
      .then(r => r.data),
};