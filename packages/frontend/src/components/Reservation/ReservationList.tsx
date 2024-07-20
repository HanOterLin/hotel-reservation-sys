import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS, GET_USER_RESERVATIONS } from '../queries/queries';
import ReservationRow from './ReservationRow';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

interface ReservationListProps {
    user: any;
}

const ReservationList: React.FC<ReservationListProps> = ({ user }) => {
    const { loading, error, data, refetch } = useQuery(user.role === 'restaurant_employee' ? GET_RESERVATIONS : GET_USER_RESERVATIONS, {
        variables: user.role === 'guest' ? { userId: user.id } : {},
        context: {
            headers: {
                authentication: `Bearer ${localStorage.getItem('token')}`
            }
        },
        skip: !user,
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Reservation List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Guest Name</TableCell>
                            <TableCell>Guest Contact</TableCell>
                            <TableCell>Arrival Time</TableCell>
                            <TableCell>Table Size</TableCell>
                            <TableCell>Status</TableCell>
                            {user.role === 'restaurant_employee' && <TableCell>Actions</TableCell>}
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
