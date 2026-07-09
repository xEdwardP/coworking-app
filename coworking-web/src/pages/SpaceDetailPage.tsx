import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, CalendarDays, Check, Coffee, Heart, MapPin, Monitor, Users, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSpace } from '../api/spaces';
import { getSpaceAvailability } from '../api/availability';
import { createReservation } from '../api/reservations';
import { getSpaceReviews, type SpaceReviewsResponse } from '../api/reviews';
import { getMyFavoriteSpaceIds, toggleFavorite } from '../api/favorites';
import { StarRating } from '../components/StarRating';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import type { Space } from '../types';

const prices: Record<Space['type'], number> = {
  SALA: 120,
  ESCRITORIO: 45,
  AUDITORIO: 400,
};

function formatInputDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-HN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

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
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
      toast.success('Solicitud enviada — revisa Mis reservas');
      setTimeout(() => navigate('/mis-reservas'), 650);
    } catch {
      toast.error('No se pudo crear la reserva. Intenta con otro horario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleFavorite() {
    if (!id) return;
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await toggleFavorite(Number(id), next);
    } catch {
      setIsFavorite(!next);
      toast.error('No se pudo actualizar tus favoritos');
    }
  }

  if (!space) return <p className="px-8 py-8 text-[#9fa59f]">Cargando espacio...</p>;

  return (
    <div className="px-6 py-7 md:px-8">
      <Link to="/explorar" className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#9fa59f] hover:text-white">
        <ArrowLeft size={16} /> Volver a explorar
      </Link>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.5fr)_624px]">
        <section>
          <div className="relative grid h-[260px] place-items-center overflow-hidden rounded-xl bg-[linear-gradient(110deg,#183827,#2f2a1e)]">
            {space.imageUrl ? (
              <img src={space.imageUrl} alt={space.name} className="h-full w-full object-cover opacity-75" />
            ) : (
              <Building2 size={48} className="text-[#39795b]" />
            )}
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#f4f5f2]">{space.name}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-[#a3aaa4]">
                <span className="flex items-center gap-1"><MapPin size={16} /> {space.location}</span>
                <span className="flex items-center gap-1"><Users size={16} /> {space.capacity} personas</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label="Agregar a favoritos"
              className="grid h-8 w-8 place-items-center rounded-full border border-[#2d3338] bg-[#1b1f23] text-[#e46f4d]"
            >
              <Heart size={16} className={isFavorite ? 'fill-[#e46f4d]' : ''} />
            </button>
          </div>

          <p className="mt-6 max-w-[680px] text-base font-medium leading-7 text-[#a6aca6]">
            {space.description ??
              'Sala cerrada con ventanal, ideal para reuniones de equipo o sesiones de trabajo enfocado. Incluye pizarra blanca y conexión para videollamadas.'}
          </p>

          <h2 className="mt-6 text-base font-extrabold text-[#f4f5f2]">Comodidades</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: 'Wifi', icon: Wifi },
              { label: 'Proyector', icon: Monitor },
              { label: 'Café de cortesía', icon: Coffee },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="flex h-9 items-center gap-2 rounded-lg border border-[#30363d] bg-[#171b1f] px-3 text-sm font-extrabold text-[#d9ded8]">
                  <Icon size={15} className="text-[#62c891]" />
                  {item.label}
                </span>
              );
            })}
          </div>

          <section className="mt-8">
            <h2 className="mb-4 text-base font-extrabold text-[#f4f5f2]">Reseñas</h2>
            <div className="rounded-xl bg-[#1b1f23] p-4">
              <p className="text-4xl font-extrabold text-[#f4f5f2]">{reviews?.average?.toFixed(1) ?? '4.8'}</p>
              <StarRating value={reviews?.average ?? 4.8} readOnly size={16} />
              <p className="mt-1 text-sm font-medium text-[#9fa59f]">{reviews?.total ?? 32} reseñas</p>
            </div>

            <div className="mt-2 divide-y divide-[#272d32]">
              {(reviews?.items ?? []).slice(0, 3).map((review) => (
                <article key={review.id} className="flex gap-3 py-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#62c891] text-xs font-extrabold text-white">
                    {(review.user?.name ?? 'US').slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-[#f4f5f2]">{review.user?.name ?? 'Usuario'}</p>
                      <StarRating value={review.rating} readOnly size={13} />
                    </div>
                    {review.comment && <p className="mt-1 text-sm font-medium text-[#a6aca6]">{review.comment}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="h-fit rounded-xl border border-[#2b3036] bg-[#181c20] p-5">
          <p className="text-2xl font-extrabold text-white">
            L {prices[space.type]} <span className="text-sm font-medium text-[#9fa59f]">/ hora</span>
          </p>
          <label className="mt-5 block font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#9db1a7]">Fecha</label>
          <div className="relative mt-2">
            <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9fa59f]" />
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setDate(event.target.value)}
              className="h-9 w-full rounded-md border border-[#2d3338] bg-[#1b1f23] pl-10 pr-3 text-sm font-extrabold text-white outline-none [color-scheme:dark]"
              aria-label={formatInputDate(date)}
            />
          </div>

          <label className="mt-4 block font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#9db1a7]">
            Horario disponible
          </label>
          <div className="mt-2">
            <TimeSlotPicker date={date} occupied={occupied} selected={selectedSlot} onSelect={setSelectedSlot} />
          </div>

          <button
            type="button"
            onClick={handleReserve}
            disabled={!selectedSlot || isSubmitting}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#52a37c] text-sm font-extrabold text-white transition hover:bg-[#5cad85] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={16} /> {isSubmitting ? 'Enviando...' : 'Reservar este horario'}
          </button>
          {submitted && (
            <p className="mt-3 rounded-lg bg-[#173f2a] px-3 py-3 text-sm font-extrabold text-[#62c891]">
              Solicitud enviada — revisa "Mis reservas"
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
