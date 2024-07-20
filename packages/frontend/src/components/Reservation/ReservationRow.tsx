import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, Grid, Button } from '@mui/material';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';

interface Reservation {
    id: string;
    guestName: string;
    guestContact: string;
    arrivalTime: Date | null;
    tableSize: number;
    status: string;
}

interface User {
    role: string; // Define as needed
}

interface ReservationRowProps {
    reservation: any;
    user: any;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}


const ReservationRow: React.FC<ReservationRowProps> = ({ reservation, user, refetch  }) => {
    const [editedGuestName, setEditedGuestName] = useState(reservation.guestName);
    const [editedGuestContact, setEditedGuestContact] = useState(reservation.guestContact);
    const [editedArrivalTime, setEditedArrivalTime] = useState<Date | null>(reservation.arrivalTime);
    const [editedTableSize, setEditedTableSize] = useState(reservation.tableSize);

    const handleSave = () => {
        refetch ({
            ...reservation,
            guestName: editedGuestName,
            guestContact: editedGuestContact,
            arrivalTime: editedArrivalTime,
            tableSize: editedTableSize,
        });
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
                <TextField
                    value={editedGuestName}
                    onChange={(e) => setEditedGuestName(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    value={editedGuestContact}
                    onChange={(e) => setEditedGuestContact(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={3}>
                <DatePicker
                    selected={editedArrivalTime}
                    onChange={(date: Date | null) => setEditedArrivalTime(date)}
                    onBlur={handleSave}
                    customInput={<TextField />}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    type="number"
                    value={editedTableSize}
                    onChange={(e) => setEditedTableSize(Number(e.target.value))}
                    fullWidth
                />
            </Grid>
            {user.role === 'restaurant_employee' && (
                <Grid item xs={1}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default ReservationRow;
