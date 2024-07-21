import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, TableRow, TableCell, Button, Select, MenuItem } from '@mui/material';
import {ApolloQueryResult, OperationVariables, useMutation} from '@apollo/client';
import {UPDATE_RESERVATION} from "../queries/mutations";

interface ReservationRowProps {
    reservation: any;
    user: any;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}


const ReservationRow: React.FC<ReservationRowProps> = ({ reservation, user, refetch  }) => {
    const [editedGuestName, setEditedGuestName] = useState(reservation.guestName);
    const [editedGuestContact, setEditedGuestContact] = useState(reservation.guestContact);
    const [editedArrivalTime, setEditedArrivalTime] = useState<Date | null>(new Date(Number(reservation.arrivalTime)));
    const [editedTableSize, setEditedTableSize] = useState(reservation.tableSize);
    const [editedStatus, setEditedStatus] = useState(reservation.status);
    const [hasChanges, setHasChanges] = useState(false);

    const [updateReservation] = useMutation(UPDATE_RESERVATION);

    useEffect(() => {
        if (
            editedGuestName !== reservation.guestName ||
            editedGuestContact !== reservation.guestContact ||
            editedArrivalTime !== reservation.arrivalTime ||
            editedTableSize !== reservation.tableSize ||
            editedStatus !== reservation.status
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [editedGuestName, editedGuestContact, editedArrivalTime, editedTableSize, editedStatus, reservation]);

    const handleSave = async () => {
        await updateReservation({
            variables: {
                id: reservation.id,
                guestName: editedGuestName,
                guestContact: editedGuestContact,
                arrivalTime: editedArrivalTime?.getTime() + '',
                tableSize: editedTableSize,
                status: editedStatus,
            },
        });
        setHasChanges(false);
        refetch();
    };

    return (
        <TableRow>
            <TableCell>
                <TextField
                    value={editedGuestName}
                    onChange={(e) => setEditedGuestName(e.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    value={editedGuestContact}
                    onChange={(e) => setEditedGuestContact(e.target.value)}
                />
            </TableCell>
            <TableCell>
                <DatePicker
                    selected={editedArrivalTime}
                    onChange={(date: Date | null) => setEditedArrivalTime(date)}
                    onBlur={handleSave}
                    customInput={<TextField />}
                />
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    value={editedTableSize}
                    onChange={(e) => setEditedTableSize(Number(e.target.value))}
                />
            </TableCell>
            <TableCell>
                {(user.role === 'restaurant_employee') ? (
                    <Select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                ) : (
                    editedStatus
                )}
            </TableCell>
            <TableCell>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={!hasChanges || user.role !== 'restaurant_employee'}>
                    Save
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default ReservationRow;