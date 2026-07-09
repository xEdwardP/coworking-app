import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import type { Space } from '../types';

const typeLabels: Record<Space['type'], string> = {
  SALA: 'Sala',
  ESCRITORIO: 'Escritorio',
  AUDITORIO: 'Auditorio',
};

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Link
      to={`/espacios/${space.id}`}
      className="group block bg-white rounded-2xl border border-[var(--color-border-subtle)] overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        {space.imageUrl ? (
          <img
            src={space.imageUrl}
            alt={space.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-900">{space.name}</h3>
          <span className="shrink-0 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full px-2 py-1">
            {typeLabels[space.type]}
          </span>
        </div>

        <p className="flex items-center gap-1 text-sm text-neutral-500">
          <MapPin size={14} /> {space.location}
        </p>
        <p className="flex items-center gap-1 text-sm text-neutral-500">
          <Users size={14} /> Hasta {space.capacity} personas
        </p>
      </div>
    </Link>
  );
}