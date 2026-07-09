import { useEffect, useState } from 'react';
import { getMyFavorites } from '../api/favorites';
import { SpaceCard } from '../components/SpaceCard';
import type { Favorite } from '../types';

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyFavorites()
      .then(setFavorites)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="px-6 py-8 md:px-8">
      <div className="mb-6">
        <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.24em] text-[#52a37c]">Guardados</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#f4f5f2]">Mis favoritos</h1>
        <p className="mt-2 text-base font-medium text-[#9fa59f]">Espacios que marcaste para reservar rápido la próxima vez.</p>
      </div>

      {isLoading ? (
        <p className="text-[#9fa59f]">Cargando...</p>
      ) : favorites.length === 0 ? (
        <p className="text-[#9fa59f]">Todavía no tienes espacios favoritos.</p>
      ) : (
        <div className="grid max-w-[530px] grid-cols-1 gap-5 sm:grid-cols-2">
          {favorites.map((fav) => (
            <SpaceCard key={fav.id} space={fav.space} />
          ))}
        </div>
      )}
    </div>
  );
}
