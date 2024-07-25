import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import ReservationList from './components/Reservation/ReservationList';
import Toast from './components/Toast/Toast';
import Register from "./components/Auth/Register";
import ReservationForm from "./components/Reservation/ReservationForm";
import { Box, CircularProgress } from "@mui/material";
import {User} from "./components/Types/User";


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login setUser={setUser}  />} />
                        <Route path="/register" element={<Register setUser={setUser}  />} />
                        <Route path="/create-reservation" element={<ReservationForm />} />
                        <Route
                            path="/create-reservation"
                            element={user ? <ReservationForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/"
                            element={user ? <ReservationList user={user} setUser={setUser} /> : <Navigate to="/login" />}
                        />
                    </Routes>
                    <Toast />
                </div>
            </Router>
        </ApolloProvider>
    );
};

export default App;
