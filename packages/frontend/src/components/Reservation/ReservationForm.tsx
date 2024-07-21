import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, Grid, Button } from '@mui/material';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_RESERVATION } from '../queries/mutations';

interface Reservation {
    guestName: string;
    guestContact: string;
    arrivalTime: Date | null;
    tableSize: number;
}

const ReservationForm: React.FC = () => {
    const [guestName, setGuestName] = useState('');
    const [guestContact, setGuestContact] = useState('');
    const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
    const [tableSize, setTableSize] = useState<number>(0);

    const navigate = useNavigate();
    const [createReservation] = useMutation(CREATE_RESERVATION);

    const handleSubmit = async () => {
        await createReservation({
            variables: {
                guestName,
                guestContact,
                arrivalTime: arrivalTime?.getTime() + '',
                tableSize,
            },
        });
        navigate('/');
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div>
            <h2>Create Reservation</h2>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Guest Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Guest Contact"
                        value={guestContact}
                        onChange={(e) => setGuestContact(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        selected={arrivalTime}
                        onChange={(date: Date | null) => setArrivalTime(date)}
                        customInput={<TextField label="Arrival Time" fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        type="number"
                        label="Table Size"
                        value={tableSize}
                        onChange={(e) => setTableSize(Number(e.target.value))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ReservationForm;
