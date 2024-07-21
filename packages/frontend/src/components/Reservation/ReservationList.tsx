import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS, GET_USER_RESERVATIONS } from '../queries/queries';
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
    Button, Box
} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";

interface ReservationListProps {
    user: any;
    setUser: (user: any) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({ user, setUser }) => {
    const navigate = useNavigate();
    const { loading, error, data, refetch } = useQuery(user.role === 'restaurant_employee' ? GET_RESERVATIONS : GET_USER_RESERVATIONS, {
        variables: user.role === 'guest' ? { userId: user.id } : {},
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
        refetch();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <Typography variant="h3" align={"center"} gutterBottom>
                Reservation List
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreate}>
                Create
            </Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
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
                            <ReservationRow key={reservation.id} reservation={reservation} user={user} refetch={refetch} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ReservationList;
