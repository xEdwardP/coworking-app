import { useEffect, useState } from 'react';
import { Building2, Mic, Plug, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { cancelReservation, getMyReservations } from '../api/reservations';
import { getDisplayStatus, StatusBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import type { Reservation, Space } from '../types';

const iconByType: Record<Space['type'], typeof Building2> = {
  SALA: Building2,
  ESCRITORIO: Plug,
  AUDITORIO: Mic,
};

function formatDateRange(reservation: Reservation) {
  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const date = start.toLocaleDateString('es-HN', { day: 'numeric', month: 'short' });
  const range = `${start.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })}-${end.toLocaleTimeString('es-HN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
  return `${date} · ${range}`;
}

export default function MisReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<Reservation | null>(null);

  function load() {
    setIsLoading(true);
    getMyReservations()
      .then(setReservations)
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleCancel(id: number) {
    try {
      await cancelReservation(id);
      toast.success('Reserva cancelada');
      load();
    } catch {
      toast.error('No se pudo cancelar la reserva');
    }
  }

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="mb-6">
        <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.24em] text-[#52a37c]">Mi actividad</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#f4f5f2]">Mis reservas</h1>
        <p className="mt-2 max-w-[520px] text-base font-medium leading-tight text-[#9fa59f]">
          Historial y próximas reservas. Las confirmadas y ya finalizadas pueden reseñarse.
        </p>
      </div>

      {isLoading ? (
        <p className="text-[#9fa59f]">Cargando...</p>
      ) : reservations.length === 0 ? (
        <p className="text-[#9fa59f]">Todavía no tienes reservas.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => {
            const displayStatus = getDisplayStatus(reservation.status, reservation.endTime);
            const hasReview = reservation.space?.reviews && reservation.space.reviews.length > 0;
            const canCancel = (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && displayStatus !== 'FINISHED' && !hasReview;
            const canReview = displayStatus === 'FINISHED' && !hasReview;
            const Icon = reservation.space?.type ? iconByType[reservation.space.type] : Building2;

            return (
              <div
                key={reservation.id}
                className="flex min-h-[74px] flex-col gap-4 rounded-xl border border-[#2b3036] bg-[#181c20] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#17442d] text-[#62c891]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-extrabold text-white">{reservation.space?.name ?? `Espacio #${reservation.spaceId}`}</p>
                    <p className="text-sm font-medium text-[#9fa59f]">{reservation.space?.location ?? 'Campus'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <p className="min-w-[190px] text-sm font-mono font-extrabold text-[#aab0ab]">{formatDateRange(reservation)}</p>
                  <StatusBadge status={hasReview ? 'COMPLETED' : displayStatus} />
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(reservation.id)}
                      className="h-8 rounded-lg border border-[#30363d] px-4 text-sm font-extrabold text-white hover:bg-[#20262a]"
                    >
                      Cancelar
                    </button>
                  )}
                  {canReview && (
                    <button
                      type="button"
                      onClick={() => setReviewTarget(reservation)}
                      className="flex h-8 items-center gap-2 rounded-lg bg-[#52a37c] px-4 text-sm font-extrabold text-white hover:bg-[#5cad85]"
                    >
                      <Star size={14} /> Dejar reseña
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal
          spaceId={reviewTarget.spaceId}
          onClose={() => setReviewTarget(null)}
          onSubmitted={load}
        />
      )}
    </div>
  );
}
