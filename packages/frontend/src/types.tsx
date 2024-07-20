// Define your types here
export interface User {
    id: string;
    username: string;
    role: string;
}

export interface Reservation {
    id: string;
    guestName: string;
    guestContact: string;
    arrivalTime: string;
    tableSize: number;
    status: string;
}
