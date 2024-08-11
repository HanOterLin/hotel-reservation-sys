// db.test.ts
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './db';

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'restaurant_reservations';
const dbUser = process.env.MONGO_USERNAME || 'admin';
const dbPassword = process.env.MONGO_PASSWORD || 'admin';

jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue(null),
    disconnect: jest.fn().mockResolvedValue(null),
}));

describe('Database Connection', () => {
    it('should connect to the database', async () => {
        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith(
            `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`, 
            {autoCreate: true});
    });

    it('should disconnect from the database', async () => {
        await disconnectDB();
        expect(mongoose.disconnect).toHaveBeenCalled();
    });
});
