import React, {useState} from 'react';
import axios from 'axios';
import {useQuery, useMutation, gql} from '@apollo/client';
import './App.css';

const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

const GET_USER_RESERVATIONS = gql`
  query GetUserReservations($userId: ID!) {
    reservations(userId: $userId) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($guestName: String!, $guestContact: String!, $arrivalTime: String!, $tableSize: Int!) {
    createReservation(guestName: $guestName, guestContact: $guestContact, arrivalTime: $arrivalTime, tableSize: $tableSize) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: ID!, $guestName: String!, $guestContact: String!, $arrivalTime: String!, $tableSize: Int!) {
    updateReservation(id: $id, guestName: $guestName, guestContact: $guestContact, arrivalTime: $arrivalTime, tableSize: $tableSize) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id) {
      id
    }
  }
`;

const MARK_RESERVATION = gql`
  mutation markReservationStatus($id: ID!, $status: String!) {
    markReservationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface User {
    id: string;
    username: string;
    role: string;
}

const App: React.FC = () => {
    const [createReservation] = useMutation(CREATE_RESERVATION);
    const [updateReservationMutation] = useMutation(UPDATE_RESERVATION);
    const [deleteReservation] = useMutation(DELETE_RESERVATION);
    const [markReservation] = useMutation(MARK_RESERVATION);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestContact, setGuestContact] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [tableSize, setTableSize] = useState<number | undefined>(undefined);

    const {
        loading,
        error,
        data,
        refetch
    } = useQuery(user?.role === 'restaurant_employee' ? GET_RESERVATIONS : GET_USER_RESERVATIONS, {
        variables: user?.role === 'guest' ? {userId: user.id} : {},
        context: {
            headers: {
                authentication: `Bearer ${localStorage.getItem('token')}`
            }
        },
        skip: !user,
    });

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/login', {username, password});
            setUser(res.data);
            const token = res.headers['authorization'];
            localStorage.setItem('token', token);
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/register', {username, password, role: 'guest'});
            setUser(res.data);
            const token = res.headers['authorization'];
            localStorage.setItem('token', token);
        } catch (err) {
            console.error('Registration failed', err);
        }
    };

    const handleCreateReservation = async () => {
        try {
            await createReservation({
                variables: {guestName, guestContact, arrivalTime, tableSize: tableSize || 0},
                context: {
                    headers: {
                        authentication: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            });
            refetch();
        } catch (err) {
            console.error('Failed to create reservation', err);
        }
    };

    const handleDeleteReservation = async (id: string) => {
        try {
            await deleteReservation({
                variables: {id},
                context: {
                    headers: {
                        authentication: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            });
            refetch();
        } catch (err) {
            console.error('Failed to delete reservation', err);
        }
    };

    const handleMarkReservation = async (id: string, status: string) => {
        try {
            await markReservation({
                variables: {id, status},
                context: {
                    headers: {
                        authentication: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            });
            refetch();
        } catch (err) {
            console.error('Failed to mark reservation', err);
        }
    };

    const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
    const [editedGuestName, setEditedGuestName] = useState('');
    const [editedGuestContact, setEditedGuestContact] = useState('');
    const [editedArrivalTime, setEditedArrivalTime] = useState('');
    const [editedTableSize, setEditedTableSize] = useState<number | undefined>(undefined);

    const startEditingReservation = (reservation: any) => {
        setEditingReservationId(reservation.id);
        setEditedGuestName(reservation.guestName);
        setEditedGuestContact(reservation.guestContact);
        setEditedArrivalTime(reservation.arrivalTime);
        setEditedTableSize(reservation.tableSize);
    };

    const cancelEditingReservation = () => {
        setEditingReservationId(null);
    };

    const saveEditedReservation = async () => {
        try {
            await updateReservationMutation({
                variables: {
                    id: editingReservationId!,
                    guestName: editedGuestName,
                    guestContact: editedGuestContact,
                    arrivalTime: editedArrivalTime,
                    tableSize: editedTableSize || 0
                },
                context: {
                    headers: {
                        authentication: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            });
            setEditingReservationId(null);
            refetch();
        } catch (err) {
            console.error('Failed to update reservation', err);
        }
    };

    if (!user) {
        return (
            <div className="auth-container">
                <h2>Reservation System</h2>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password}
                       onChange={e => setPassword(e.target.value)}/>
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister}>Register</button>
            </div>
        );
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Hotel Reservation System</h1>
            <h2>Welcome, {user.username}</h2>
            {user.role === 'guest' ? (
                <div>
                    <h3>Create a new reservation</h3>
                    <input type="text" placeholder="Guest Name" value={guestName}
                           onChange={e => setGuestName(e.target.value)}/>
                    <input type="text" placeholder="Guest Contact" value={guestContact}
                           onChange={e => setGuestContact(e.target.value)}/>
                    <input type="text" placeholder="Arrival Time" value={arrivalTime}
                           onChange={e => setArrivalTime(e.target.value)}/>
                    <input type="number" placeholder="Table Size" value={tableSize}
                           onChange={e => setTableSize(parseInt(e.target.value) || 0)}/>
                    <button onClick={handleCreateReservation}>Create Reservation</button>
                </div>
            ) : null}
            <h3>Reservations</h3>
            <ul>
                {data && data.reservations ? (data.reservations.map((reservation: any) => (
                    <li key={reservation.id}>
                        {editingReservationId === reservation.id ? (
                            <>
                                <input type="text" value={editedGuestName}
                                       onChange={e => setEditedGuestName(e.target.value)}/>
                                <input type="text" value={editedGuestContact}
                                       onChange={e => setEditedGuestContact(e.target.value)}/>
                                <input type="text" value={editedArrivalTime}
                                       onChange={e => setEditedArrivalTime(e.target.value)}/>
                                <input type="number" value={editedTableSize}
                                       onChange={e => setEditedTableSize(parseInt(e.target.value) || 0)}/>
                                <button onClick={saveEditedReservation}>Save</button>
                                <button onClick={cancelEditingReservation}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {reservation.guestName} - {reservation.guestContact} - {reservation.arrivalTime} - {reservation.tableSize} - {reservation.status}
                                <button onClick={() => startEditingReservation(reservation)}>Update</button>
                                <button onClick={() => handleMarkReservation(reservation.id, 'canceled')}>Mark as
                                    Canceled
                                </button>
                                {user.role === 'restaurant_employee' ? (
                                    <>
                                        <button onClick={() => handleDeleteReservation(reservation.id)}>Delete</button>
                                        <button onClick={() => handleMarkReservation(reservation.id, 'completed')}>Mark
                                            as
                                            Completed
                                        </button>
                                    </>
                                ) : null}
                            </>
                        )}
                    </li>
                ))) : (
                    <li>No reservations found.</li>
                )}
            </ul>
        </div>
    );
};

export default App;
