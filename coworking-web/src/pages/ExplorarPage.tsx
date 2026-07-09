import { useEffect, useMemo, useState } from 'react';
import { getSpaces } from '../api/spaces';
import { SpaceCard } from '../components/SpaceCard';
import type { Space, SpaceType } from '../types';

const filters: { label: string; value: SpaceType | 'TODOS' }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Salas', value: 'SALA' },
  { label: 'Escritorios', value: 'ESCRITORIO' },
  { label: 'Auditorios', value: 'AUDITORIO' },
];

export default function ExplorarPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SpaceType | 'TODOS'>('TODOS');
  const [search, setSearch] = useState('');

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Encuentra tu espacio ideal</h1>
        <p className="text-neutral-500 mt-1">
          {filteredSpaces.length} espacios disponibles
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o ubicación…"
        className="w-full md:w-96 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              activeFilter === f.value
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-neutral-500">Cargando espacios…</p>
      ) : filteredSpaces.length === 0 ? (
        <p className="text-neutral-500">No hay espacios que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}