import { api } from './client';
import type { Space } from '../types';

export function getSpaces() {
  return api.get<Space[]>('/spaces').then((r) => r.data);
}

export function getSpace(id: number | string) {
  return api.get<Space>(`/spaces/${id}`).then((r) => r.data);
}