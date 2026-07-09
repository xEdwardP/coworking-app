import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpace } from '../api/spaces';
import { getSpaceAvailability } from '../api/availability';
import { createReservation } from '../api/reservations';
import { getSpaceReviews, type SpaceReviewsResponse } from '../api/reviews';
import { toggleFavorite, getMyFavoriteSpaceIds } from '../api/favorites';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { StarRating } from '../components/StarRating';
import type { Space } from '../types';
import { Heart } from 'lucide-react';

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [reviews, setReviews] = useState<SpaceReviewsResponse | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [occupied, setOccupied] = useState<{ startTime: string; endTime: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getSpace(id).then(setSpace);
    getSpaceReviews(id).then(setReviews);
    getMyFavoriteSpaceIds().then((ids) => setIsFavorite(ids.includes(Number(id))));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getSpaceAvailability(id, date).then(setOccupied);
    setSelectedSlot(null);
  }, [id, date]);

  async function handleReserve() {
    if (!id || !selectedSlot) return;
    setIsSubmitting(true);
    try {
      const start = new Date(selectedSlot);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      await createReservation({
        spaceId: Number(id),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      toast.success('Solicitud enviada — revisa Mis reservas');
      navigate('/mis-reservas');
    } catch {
      toast.error('No se pudo crear la reserva. Intenta con otro horario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleFavorite() {
    if (!id) return;
    const next = !isFavorite;
    setIsFavorite(next); // optimista
    try {
      await toggleFavorite(Number(id), next);
    } catch {
      setIsFavorite(!next);
      toast.error('No se pudo actualizar tus favoritos');
    }
  }

  if (!space) return <p className="text-neutral-500">Cargando espacio…</p>;

  return (
    <div className="space-y-8">
      <Link to="/explorar" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={16} /> Volver a explorar
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
          {space.imageUrl && (
            <img src={space.imageUrl} alt={space.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{space.name}</h1>
            <button
              onClick={handleToggleFavorite}
              aria-label="Agregar a favoritos"
              className="p-2 rounded-full border border-neutral-200 hover:border-red-300 transition"
            >
              <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1"><MapPin size={16} /> {space.location}</span>
            <span className="flex items-center gap-1"><Users size={16} /> Hasta {space.capacity} personas</span>
          </div>

          {space.description && <p className="text-neutral-700">{space.description}</p>}

          {reviews && reviews.total > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <StarRating value={reviews.average} readOnly size={16} />
              <span className="text-neutral-500">
                {reviews.average.toFixed(1)} · {reviews.total} reseña{reviews.total !== 1 && 's'}
              </span>
            </div>
          )}

          <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-3">
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">Horario disponible</label>
            <TimeSlotPicker date={date} occupied={occupied} selected={selectedSlot} onSelect={setSelectedSlot} />

            <button
              onClick={handleReserve}
              disabled={!selectedSlot || isSubmitting}
              className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando…' : 'Reservar este horario'}
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reseñas</h2>
        {!reviews || reviews.items.length === 0 ? (
          <p className="text-neutral-500 text-sm">Este espacio todavía no tiene reseñas.</p>
        ) : (
          <div className="space-y-4">
            {reviews.items.map((review) => (
              <div key={review.id} className="border border-[var(--color-border-subtle)] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{review.user?.name ?? 'Usuario'}</span>
                  <StarRating value={review.rating} readOnly size={14} />
                </div>
                {review.comment && <p className="text-sm text-neutral-600 mt-2">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}