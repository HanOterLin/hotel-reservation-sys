import mongoose from 'mongoose';
import logger from '../utils/logger';

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'restaurant_reservations';
const dbUser = process.env.MONGO_USERNAME || 'admin';
const dbPassword = process.env.MONGO_PASSWORD || 'admin';

const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(dbUrl, {
            autoCreate: true,
        });
        logger.sys_info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.sys_error(`Error connecting to MongoDB: ${error}`);
        throw error;
    }
};

export default connectDB;
