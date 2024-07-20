import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client'; // Update the path as needed
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import ReservationList from './components/Reservation/ReservationList';
import Toast from './components/Toast/Toast';
import { User } from './types'; // Import the User type

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route
                            path="/"
                            element={user ? <ReservationList user={user} /> : <Navigate to="/login" />}
                        />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                    </Routes>
                    <Toast />
                </div>
            </Router>
        </ApolloProvider>
    );
};

export default App;
