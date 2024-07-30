import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {User} from "../../types";
import 'react-toastify/dist/ReactToastify.css'

interface LoginProps {
    setUser: (user: User) => void;
}

const Register: React.FC<LoginProps> = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/register', { username, password, role: 'guest' });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            const token = res.headers['authorization'];
            localStorage.setItem('token', token);
            toast.success('Register successful', { autoClose: 1000 });
            navigate('/');
        } catch (err) {
            console.error('Register failed', err);
            toast.error('Register failed', { autoClose: 1000 });
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="xs" style={{ minWidth: '400px'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4">Register</Typography>
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
                    style={{ marginBottom: '10px' }}
                >
                    Register
                </Button>
                <Button
                    fullWidth variant="outlined"
                    onClick={handleBack}
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
