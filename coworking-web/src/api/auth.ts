import { api } from './client';
import type { User } from '../types';

interface LoginResponse {
  accessToken: string;
  user: User;
}

export function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data);
}

export function register(name: string, email: string, password: string) {
  return api.post<User>('/users', { name, email, password }).then((r) => r.data);
}

export function me() {
  return api.get<User>('/auth/me').then((r) => r.data);
}