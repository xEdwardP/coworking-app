import { api } from './client';

export interface OccupiedSlot {
  startTime: string;
  endTime: string;
}

export function getSpaceAvailability(spaceId: number | string, date: string) {
  return api
    .get<OccupiedSlot[]>(`/spaces/${spaceId}/availability`, { params: { date } })
    .then((r) => r.data)
    .catch(() => [] as OccupiedSlot[]);
}