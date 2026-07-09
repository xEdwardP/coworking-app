import { useEffect, useMemo, useState } from 'react';
import { Building2, Coffee, Mic, Monitor, Plug, Wifi } from 'lucide-react';
import { getSpaces } from '../api/spaces';
import { SpaceCard } from '../components/SpaceCard';
import type { Space, SpaceType } from '../types';

const filters: { label: string; value: SpaceType | 'TODOS'; icon?: typeof Building2 }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Salas', value: 'SALA', icon: Building2 },
  { label: 'Escritorios', value: 'ESCRITORIO', icon: Plug },
  { label: 'Auditorios', value: 'AUDITORIO', icon: Mic },
];

const amenityFilters = [
  { label: 'Wifi', icon: Wifi },
  { label: 'Proyector', icon: Monitor },
  { label: 'Café', icon: Coffee },
];

export default function ExplorarPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SpaceType | 'TODOS'>('TODOS');
  const [search] = useState('');

  useEffect(() => {
    getSpaces()
      .then(setSpaces)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesType = activeFilter === 'TODOS' || space.type === activeFilter;
      const matchesSearch =
        !search ||
        space.name.toLowerCase().includes(search.toLowerCase()) ||
        space.location.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch && space.status;
    });
  }, [spaces, activeFilter, search]);

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="mb-5">
        <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.24em] text-[#52a37c]">
          Nido · Coworking
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#f4f5f2]">Encuentra tu espacio ideal</h1>
        <p className="mt-2 max-w-[520px] text-base font-medium leading-tight text-[#9fa59f]">
          {filteredSpaces.length} espacios disponibles hoy en el campus. Filtra por tipo o por lo que necesites en la sala.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`flex h-8 items-center gap-2 rounded-full border px-4 text-sm font-extrabold transition ${
                isActive
                  ? 'border-[#52a37c] bg-[#52a37c] text-white'
                  : 'border-[#2d3338] bg-[#171b1f] text-[#9ea49e] hover:border-[#3d4943]'
              }`}
            >
              {Icon && <Icon size={14} />}
              {filter.label}
            </button>
          );
        })}
        <span className="mx-1 hidden h-6 w-px bg-[#2d3338] sm:block" />
        {amenityFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.label}
              type="button"
              className="flex h-8 items-center gap-2 rounded-full border border-[#2d3338] bg-[#171b1f] px-4 text-sm font-extrabold text-[#9ea49e]"
            >
              <Icon size={14} />
              {filter.label}
            </button>
          );
        })}
        <span className="ml-auto hidden text-sm font-extrabold text-[#a3aaa4] md:inline">{filteredSpaces.length} espacios</span>
      </div>

      {isLoading ? (
        <p className="text-[#9fa59f]">Cargando espacios...</p>
      ) : filteredSpaces.length === 0 ? (
        <p className="text-[#9fa59f]">No hay espacios que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
