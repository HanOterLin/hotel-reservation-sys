import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import client from "./components/Apollo/ApolloClient";

const theme = createTheme();

ReactDOM.render(
    <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
            <App />
            <ToastContainer />
        </ThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
);
