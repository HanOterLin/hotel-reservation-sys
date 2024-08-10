import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
    headers: {
        authentication: `Bearer ${localStorage.getItem('token')}`,
    },
    name: 'WebSite',
    version: '1.0'
});

export default client;
