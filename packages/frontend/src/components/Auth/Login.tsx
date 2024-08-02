import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {User} from "../../types";
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
    setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/auth/login', { username, password });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            const token = res.headers['authorization'];
            localStorage.setItem('token', token);
            toast.success('Login successful', { autoClose: 600 });
            navigate('/');
        } catch (err) {
            console.error('Login failed', err);
            toast.error('Login failed', { autoClose: 600 });
        }
    };

    const handleToRegister = () => {
        navigate('/register');
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
                <Typography component="h1" variant="h4" >Reservation System</Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    style={{ marginBottom: '10px' }}
                >
                    Login
                </Button>
                <Button
                    fullWidth
                    color="primary"
                    variant="outlined"
                    onClick={handleToRegister}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
