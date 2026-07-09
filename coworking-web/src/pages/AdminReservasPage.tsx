import { useEffect, useState } from 'react';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllReservations, updateReservationStatus } from '../api/reservations';
import { getDisplayStatus, StatusBadge } from '../components/StatusBadge';
import type { Reservation } from '../types';

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

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    setIsLoading(true);
    getAllReservations()
      .then(setReservations)
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleStatusUpdate(id: number, status: 'CONFIRMED' | 'CANCELLED') {
    try {
      await updateReservationStatus(id, status);
      toast.success(status === 'CONFIRMED' ? 'Reserva aprobada' : 'Reserva rechazada');
      load();
    } catch {
      toast.error('No se pudo actualizar la reserva');
    }
  }

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="mb-6">
        <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.24em] text-[#52a37c]">Panel de control</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#f4f5f2]">Administración de Reservas</h1>
        <p className="mt-2 max-w-[520px] text-base font-medium leading-tight text-[#9fa59f]">
          Gestiona las reservas de todos los usuarios. Puedes aprobarlas o rechazarlas.
        </p>
      </div>

      {isLoading ? (
        <p className="text-[#9fa59f]">Cargando...</p>
      ) : reservations.length === 0 ? (
        <p className="text-[#9fa59f]">No hay reservas en el sistema.</p>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => {
            const displayStatus = getDisplayStatus(reservation.status, reservation.endTime);
            const isPending = reservation.status === 'PENDING';

            return (
              <div
                key={reservation.id}
                className="flex min-h-[74px] flex-col gap-4 rounded-xl border border-[#2b3036] bg-[#181c20] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#17442d] text-[#62c891]">
                    <Building2 size={18} />
                  </span>
                  <div>
                    <p className="font-extrabold text-white">
                      {reservation.space?.name ?? `Espacio #${reservation.spaceId}`}
                    </p>
                    <p className="text-sm font-medium text-[#9fa59f]">
                      Usuario: {reservation.user?.name ?? `ID #${reservation.userId}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <p className="min-w-[190px] text-sm font-mono font-extrabold text-[#aab0ab]">
                    {formatDateRange(reservation)}
                  </p>
                  <StatusBadge status={displayStatus} />
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#52a37c] px-3 text-sm font-extrabold text-[#52a37c] hover:bg-[#163c29]"
                      >
                        <CheckCircle size={14} /> Aprobar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#e16044] px-3 text-sm font-extrabold text-[#e16044] hover:bg-[#51281a]"
                      >
                        <XCircle size={14} /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
