import React, { useState } from 'react';
import axios, {AxiosInstance} from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {User} from "../Types/User";
import {useMutation} from "@apollo/client";
import {REGISTER_MUTATION} from "../queries/mutations";

interface RegisterProps {
    apiClient?: AxiosInstance,
    setUser: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [register, { loading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            if (data?.register) {
                setUser(data.register.user);
                localStorage.setItem('user', JSON.stringify(data.register.user));
                const token = data.register.accessToken;
                localStorage.setItem('token', token);
                toast.success('Register successful');
                navigate('/');
            }
        },
        onError: (error) => {
            console.error('Register failed', error);
            toast.error('Register failed');
        }
    });

    const handleRegister = async () => {
        try {
            await register({ variables: { username, password } });
        } catch (err) {
            console.error('Error during Register mutation', err);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">Register</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                >
                    Register
                </Button>
                <Button
                    fullWidth variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
