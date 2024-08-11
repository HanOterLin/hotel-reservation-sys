import User from '../models/user.model';
import { UserRoles } from '../constants';
import logger from '../utils/logger';
import { hashPassword } from '../utils/hash_password';

const DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME || 'admin';
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'admin';

const initializeDB = async () => {
    try {
        await User.findOneAndDelete({ username: DEFAULT_USER_NAME });
        const newUser = new User({
            username: DEFAULT_USER_NAME,
            password: hashPassword(DEFAULT_USER_PASSWORD),
            role: UserRoles.EMPLOYEE
        });
        await newUser.save();
        logger.sys_info('Database initialized successfully');
    } catch (error) {
        logger.sys_error(`Error initializing database: ${error}`);
    }
};

export default initializeDB;
