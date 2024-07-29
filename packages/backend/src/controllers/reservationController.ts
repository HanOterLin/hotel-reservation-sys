import { Request, Response } from 'express';
import Reservation from '../models/reservation';
import {ReservStatus, UserRoles} from "../constants";
import {RequestWithUser} from "../types";

export const addReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedReservation) {
            res.status(200).json(updatedReservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const cancelReservation = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id, { status: ReservStatus.CANCELLED }, { new: true }
        );
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        let reservations = await Reservation.find();

        if ((req as RequestWithUser).role === UserRoles.GUEST) {
            reservations = reservations.filter(
                (reservation: { status: string }) => reservation.status !== ReservStatus.CANCELLED
            );
        }

        res.status(200).json(reservations);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
