import { api } from './client';
import type { Reservation } from '../types';

export function createReservation(payload: {
  spaceId: number;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  return api.post<Reservation>('/reservations', payload).then((r) => r.data);
}

export function getMyReservations() {
  return api.get<Reservation[]>('/reservations/me').then((r) => r.data);
}

export function getAllReservations() {
  return api.get<Reservation[]>('/reservations').then((r) => r.data);
}

export function updateReservationStatus(id: number, status: 'CONFIRMED' | 'CANCELLED') {
  return api.patch<Reservation>(`/reservations/${id}/status`, { status }).then((r) => r.data);
}

export function cancelReservation(id: number) {
  return api.delete(`/reservations/${id}`);
}