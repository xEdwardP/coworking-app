export type Role = 'USER' | 'ADMIN';
export type SpaceType = 'SALA' | 'ESCRITORIO' | 'AUDITORIO';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Space {
  id: number;
  name: string;
  description?: string | null;
  location: string;
  capacity: number;
  type: SpaceType;
  imageUrl?: string | null;
  status: boolean;
  reviews?: Review[];
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  reason?: string | null;
  space?: Space;
  user?: User;
}

export interface Review {
  id: number;
  spaceId: number;
  userId: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { name: string };
}

export interface Favorite {
  id: number;
  userId: number;
  spaceId: number;
  space: Space;
}