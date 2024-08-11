import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { setupGraphQL } from './graphql';
import { verifyJWT } from './middlewares/auth.middleware';
import { connectDB, disconnectDB } from './config/db';
import logger from './utils/logger';

// env
if (process.env.NODE_ENV) {
    dotenv.config({ path: `./envs/${process.env.NODE_ENV}.env` });
} else {
    logger.sys_error('Invalid env!');
    process.exit(1);
}

connectDB();

const app = express();

// Set up CORS options
app.use(cors({
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

// Add middleware to expose a custom header in the CORS response
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/graphql', verifyJWT);

setupGraphQL(app);

const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

app.use(errorHandler);

// listen process
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing MongoDB connection');
    await disconnectDB();
    console.log('MongoDB connection closed');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing MongoDB connection');
    await disconnectDB();
    console.log('MongoDB connection closed');
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    console.error('There was an uncaught error:', err);
    await disconnectDB();
    console.log('MongoDB connection closed due to uncaught exception');
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await disconnectDB();
    console.log('MongoDB connection closed due to unhandled rejection');
    process.exit(1);
});

process.on('rejectionHandled', (promise) => {
    console.log('A rejected promise was handled:', promise);
});

export { app, server, mongoose };