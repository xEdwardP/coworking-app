import type { ReservationStatus } from '../types';

export type DisplayStatus = ReservationStatus | 'FINISHED';

const styles: Record<DisplayStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  FINISHED: 'bg-neutral-200 text-neutral-600',
};

const labels: Record<DisplayStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  FINISHED: 'Finalizada',
};

export function getDisplayStatus(status: ReservationStatus, endTime: string): DisplayStatus {
  if (status === 'CONFIRMED' && new Date(endTime) < new Date()) return 'FINISHED';
  return status;
}

export function StatusBadge({ status }: { status: DisplayStatus }) {
  return (
    <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}