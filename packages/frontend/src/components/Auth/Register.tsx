import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

interface LoginProps {
    setUser: (user: any) => void;
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
            toast.success('Register successful');
            navigate('/');
        } catch (err) {
            console.error('Register failed', err);
            toast.error('Register failed');
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
                >
                    Back
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
