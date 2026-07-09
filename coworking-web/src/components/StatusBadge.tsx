import type { ReservationStatus } from '../types';

export type DisplayStatus = ReservationStatus | 'FINISHED';

const styles: Record<DisplayStatus, string> = {
  PENDING: 'bg-[#3b2e12] text-[#e4b044]',
  CONFIRMED: 'bg-[#19482f] text-[#62c891]',
  CANCELLED: 'bg-[#51281a] text-[#e46f4d]',
  FINISHED: 'bg-[#19482f] text-[#62c891]',
};

const labels: Record<DisplayStatus, string> = {
  PENDING: 'PENDIENTE',
  CONFIRMED: 'CONFIRMADA',
  CANCELLED: 'CANCELADA',
  FINISHED: 'FINALIZADA',
};

export function getDisplayStatus(status: ReservationStatus, endTime: string): DisplayStatus {
  if (status === 'CONFIRMED' && new Date(endTime) < new Date()) return 'FINISHED';
  return status;
}

export function StatusBadge({ status }: { status: DisplayStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 font-mono text-xs font-extrabold tracking-wider ${styles[status]}`}>
      <span className="mr-1">•</span>
      {labels[status]}
    </span>
  );
}
