import { Request } from 'express';

export interface UserContext {
    userId: string;
    role: UserRole;
}

export interface RequestWithUser extends Request {
    ctx: UserContext
}

export type UserRole = 'guest' | 'restaurant_employee';

export type ReservationStatus = 'pending' | 'completed' | 'cancelled';