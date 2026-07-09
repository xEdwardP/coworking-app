import { api } from './client';
import type { Review } from '../types';

export interface SpaceReviewsResponse {
  items: Review[];
  total: number;
  average: number;
}

export function getSpaceReviews(spaceId: number | string) {
  return api.get<SpaceReviewsResponse>(`/spaces/${spaceId}/reviews`).then((r) => r.data);
}

export function createReview(spaceId: number, payload: { rating: number; comment?: string }) {
  return api.post(`/spaces/${spaceId}/reviews`, payload);
}