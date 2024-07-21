import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_RESERVATIONS} from '../queries/queries';
import ReservationRow from './ReservationRow';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";

interface ReservationListProps {
    user: any;
    setUser: (user: any) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({user, setUser}) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const {loading, error, data, refetch} = useQuery(
        GET_RESERVATIONS, {
            variables: {
                userId: user.role === 'guest' ? user.id : undefined,
                arrivalTime: selectedDate ? (selectedDate.getTime() + '') : undefined,
                status: selectedStatus || undefined,
            },
            context: {
                headers: {
                    authentication: `Bearer ${localStorage.getItem('token')}`
                }
            },
            skip: !user,
        });

    const handleCreate = () => {
        navigate('/create-reservation'); // Navigate back to the ReservationList page
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        if (user) {
            refetch();
        }
    }, [selectedDate, selectedStatus, user, refetch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h3" align="center" gutterBottom>
                    Reservation List
                </Typography>
                <Box display="flex" alignItems="center">
                    <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginRight: '10px' }}>
                        Create
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    isClearable
                    placeholderText="Select Date"
                />
                <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as string)}
                        label="Status"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>Guest Name</TableCell>
                            <TableCell align={"center"}>Guest Contact</TableCell>
                            <TableCell align={"center"}>Arrival Time</TableCell>
                            <TableCell align={"center"}>Table Size</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            {user.role === 'restaurant_employee' && <TableCell align={"center"}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.reservations.map((reservation: any) => (
                            <ReservationRow key={reservation.id} reservation={reservation} user={user}
                                            refetch={refetch}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ReservationList;
