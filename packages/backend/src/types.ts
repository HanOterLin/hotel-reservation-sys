import { Request } from 'express';

export interface RequestWithUser extends Request {
    userId: string;
    role: UserRole;
}

export type UserRole = 'guest' | 'restaurant_employee';

export type ReservationStatus = 'pending' | 'completed' | 'cancelled';