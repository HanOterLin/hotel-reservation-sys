import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
    guestId: mongoose.Types.ObjectId;
    guestName: string;
    guestContact: string;
    arrivalTime: string;
    tableSize: number;
    status: 'pending' | 'completed' | 'cancelled';
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
