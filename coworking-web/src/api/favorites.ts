import { api } from './client';
import type { Favorite } from '../types';

export function getMyFavorites() {
  return api.get<Favorite[]>('/favorites/me').then((r) => r.data);
}

export function getMyFavoriteSpaceIds() {
  return getMyFavorites().then((favs) => favs.map((f) => f.spaceId));
}

export function toggleFavorite(spaceId: number, shouldAdd: boolean) {
  return shouldAdd
    ? api.post('/favorites', { spaceId })
    : api.delete(`/favorites/${spaceId}`);
}