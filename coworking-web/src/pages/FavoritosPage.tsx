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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Mis favoritos</h1>

      {isLoading ? (
        <p className="text-neutral-500">Cargando…</p>
      ) : favorites.length === 0 ? (
        <p className="text-neutral-500">Todavía no tienes espacios favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => (
            <SpaceCard key={fav.id} space={fav.space} />
          ))}
        </div>
      )}
    </div>
  );
}