import express, {ErrorRequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { setupGraphQL } from './graphql';
import User from "./models/user";
import bcrypt from "bcryptjs";
import { verifyToken } from "./middlewares/authMiddleware";
import {UserRoles} from "./constants";

const app = express();
const port = 3001;

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'restaurant_reservations';
const dbUser = process.env.MONGO_USERNAME || 'admin';
const dbPassword = process.env.MONGO_PASSWORD || 'admin';

const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(dbUrl, {
    autoCreate: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // init: default user 'admin'
    await User.findOneAndDelete({ username: 'admin' });
    const newUser = new User({ username: 'admin', password: bcrypt.hashSync('admin', 8), role: UserRoles.EMPLOYEE });
    await newUser.save();

}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

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
app.use('/graphql', verifyToken);

setupGraphQL(app);

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
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing MongoDB connection');
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
});

process.on('uncaughtException', async (err) => {
    console.error('There was an uncaught error:', err);
    await mongoose.disconnect();
    console.log('MongoDB connection closed due to uncaught exception');
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await mongoose.disconnect();
    console.log('MongoDB connection closed due to unhandled rejection');
    process.exit(1);
});

process.on('rejectionHandled', (promise) => {
    console.log('A rejected promise was handled:', promise);
});

export {app, server, mongoose};