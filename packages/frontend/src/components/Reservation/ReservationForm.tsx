import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, Grid, Button, Container, Typography, Box } from '@mui/material';
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
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4">Create Reservation</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={15}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            label="Guest Name"
                            inputProps={{ maxLength: 127 }}
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={15}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            label="Guest Contact"
                            inputProps={{ maxLength: 127 }}
                            value={guestContact}
                            onChange={(e) => setGuestContact(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={15}>
                        <DatePicker
                            required
                            selected={arrivalTime}
                            onChange={(date: Date | null) => setArrivalTime(date)}
                            minDate={new Date()}
                            customInput={<TextField label="Arrival Time" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} md={15}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            type="number"
                            label="Table Size"
                            inputProps={{ min: 1, max: 10 }}
                            value={tableSize}
                            onChange={(e) => setTableSize(Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Create
                        </Button>
                        <Button variant="outlined" onClick={handleBack}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ReservationForm;
