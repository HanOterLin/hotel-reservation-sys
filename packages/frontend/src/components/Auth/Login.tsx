import React, {useState} from 'react';
import {TextField, Button, Typography, Container, Box} from '@mui/material';
import {toast} from 'react-toastify';
import {useNavigate} from "react-router-dom";
import {User} from "../Types/User";
import {LOGIN_MUTATION} from "../queries/mutations";
import {useMutation} from "@apollo/client";

interface LoginProps {
    setUser: (user: User) => void
}

const Login: React.FC<LoginProps> = ({setUser}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            if (data?.login) {
                setUser(data.login.user);
                localStorage.setItem('user', JSON.stringify(data.login.user));
                const token = data.login.accessToken;
                localStorage.setItem('token', token);
                toast.success('Login successful');
                navigate('/');
            }
        },
        onError: (error) => {
            console.error('Login failed', error);
            toast.error('Login failed');
        }
    });

    const handleLogin = async () => {
        try {
            await login({ variables: { username, password } });
        } catch (err) {
            console.error('Error during login mutation', err);
        }
    };

    const handleToRegister = () => {
        navigate('/register');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4">Reservation System</Typography>
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
                >
                    Login
                </Button>
                <Button
                    fullWidth
                    color="primary"
                    variant="outlined"
                    onClick={handleToRegister}
                    disabled={loading}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
