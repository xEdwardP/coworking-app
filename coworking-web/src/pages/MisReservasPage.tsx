import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyReservations, cancelReservation } from '../api/reservations';
import { StatusBadge, getDisplayStatus } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import type { Reservation } from '../types';

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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Mis reservas</h1>

      {isLoading ? (
        <p className="text-neutral-500">Cargando…</p>
      ) : reservations.length === 0 ? (
        <p className="text-neutral-500">Todavía no tienes reservas.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => {
            const displayStatus = getDisplayStatus(reservation.status, reservation.endTime);
            const canCancel = reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
            const canReview = displayStatus === 'FINISHED';

            return (
              <div
                key={reservation.id}
                className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{reservation.space?.name ?? `Espacio #${reservation.spaceId}`}</p>
                  <p className="text-sm text-neutral-500">
                    {new Date(reservation.startTime).toLocaleString('es-HN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={displayStatus} />
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Cancelar
                    </button>
                  )}
                  {canReview && (
                    <button
                      onClick={() => setReviewTarget(reservation)}
                      className="text-sm font-medium text-neutral-900 hover:underline"
                    >
                      Dejar reseña
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