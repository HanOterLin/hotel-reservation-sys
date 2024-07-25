import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, from, gql, useMutation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import {toast} from "react-toastify";

// Create a link to handle HTTP requests
const httpLink = new HttpLink({ uri: 'http://localhost:3001/graphql' });

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
        console.error('Network error', networkError);
    }
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions.code === 'UNAUTHENTICATED') {
                // Token expired, attempt to refresh
                fetch('http://localhost:3001/refresh-token', {
                    method: 'POST',
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(data => {
                        // Store new token
                        const newAccessToken = data.accessToken;
                        localStorage.setItem('token', newAccessToken);
                        // Retry the failed request
                        const retryLink = new ApolloLink((operation, forward) => {
                            operation.setContext({
                                headers: {
                                    authorization: `Bearer ${newAccessToken}`
                                }
                            });
                            return forward(operation);
                        });
                        return retryLink.concat(httpLink);
                    })
                    .catch(error => {
                        console.error('Token refresh failed', error);
                        toast.error('Session expired, please log in again');
                    });
            }
        }
    }
});

// Add authorization header to each request
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

// Create Apollo Client
const client = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache()
});

export default client;