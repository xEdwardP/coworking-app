import { Link } from 'react-router-dom';
import { Building2, Coffee, Heart, MapPin, Mic, Monitor, Plug, Star, Wifi } from 'lucide-react';
import type { Space } from '../types';

const typeLabels: Record<Space['type'], string> = {
  SALA: 'SALA',
  ESCRITORIO: 'ESCRITORIO',
  AUDITORIO: 'AUDITORIO',
};

const typeIcons = {
  SALA: Building2,
  ESCRITORIO: Plug,
  AUDITORIO: Mic,
};

const prices: Record<Space['type'], number> = {
  SALA: 120,
  ESCRITORIO: 45,
  AUDITORIO: 400,
};

function metaFor(space: Space) {
  const rating = space.type === 'ESCRITORIO' ? 4.9 : space.type === 'AUDITORIO' ? 4.7 : space.id % 2 ? 4.8 : 4.6;
  const reviews = space.type === 'ESCRITORIO' ? 58 : space.type === 'AUDITORIO' ? 12 : space.id % 2 ? 32 : 21;
  return { rating, reviews, price: prices[space.type] };
}

export function SpaceCard({ space }: { space: Space }) {
  const Icon = typeIcons[space.type];
  const { rating, reviews, price } = metaFor(space);

  return (
    <Link
      to={`/espacios/${space.id}`}
      className="group block overflow-hidden rounded-xl border border-[#2b3036] bg-[#181c20] transition hover:border-[#3f4a44]"
    >
      <div className="relative grid aspect-[1.72] place-items-center bg-[#193325]">
        {space.imageUrl ? (
          <img
            src={space.imageUrl}
            alt={space.name}
            className="h-full w-full object-cover opacity-70 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon size={34} className="text-[#39795b]" strokeWidth={2.2} />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#1a1d24] px-2 py-1 text-[10px] font-extrabold tracking-widest text-[#a8c5b5]">
          {typeLabels[space.type]}
        </span>
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#e9efeb] text-[#59a980]">
          <Heart size={16} className="fill-[#e1a38f] text-[#e1a38f]" />
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-extrabold tracking-tight text-[#f2f3ef]">{space.name}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-[#9da39d]">
          <MapPin size={14} />
          {space.location} · {space.capacity} pers.
        </p>

        <div className="mt-3 flex gap-2 text-[#a7aeaa]">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-[#30363d] bg-[#1b2024]">
            <Wifi size={13} />
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-md border border-[#30363d] bg-[#1b2024]">
            <Monitor size={13} />
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-md border border-[#30363d] bg-[#1b2024]">
            <Coffee size={13} />
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#2a3035] pt-3">
          <span className="flex items-center gap-1 text-sm font-extrabold text-[#f4f0dd]">
            <Star size={14} className="fill-[#e6b957] text-[#e6b957]" />
            {rating.toFixed(1)}
            <span className="font-bold text-[#8f9892]">({reviews})</span>
          </span>
          <span className="text-sm font-extrabold text-[#62c891]">
            L {price}
            <span className="ml-1 text-xs font-bold text-[#a4aaa4]">/hr</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
