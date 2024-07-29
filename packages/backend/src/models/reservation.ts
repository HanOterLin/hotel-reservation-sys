import mongoose, { Document, Schema } from 'mongoose';
import {ReservationStatus} from "../types";

export interface IReservation extends Document {
    guestId: mongoose.Types.ObjectId;
    guestName: string;
    guestContact: string;
    arrivalTime: string;
    tableSize: number;
    status: ReservationStatus;
}

const ReservationSchema: Schema = new Schema({
    guestId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guestName: { type: String, required: true },
    guestContact: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    tableSize: { type: Number, required: true },
    status: { type: String, required: true }
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
