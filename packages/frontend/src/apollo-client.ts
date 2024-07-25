import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export default client;
