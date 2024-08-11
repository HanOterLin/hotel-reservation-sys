import User from '../models/user.model';
import { UserRoles } from '../constants';
import logger from '../utils/logger';
import { hashPassword } from '../utils/hash_password';

const initializeDB = async () => {
    try {
        await User.findOneAndDelete({ username: 'admin' });
        const newUser = new User({
            username: 'admin',
            password: hashPassword('admin'),
            role: UserRoles.EMPLOYEE
        });
        await newUser.save();
        logger.sys_info('Database initialized successfully');
    } catch (error) {
        logger.sys_error(`Error initializing database: ${error}`);
    }
};

export default initializeDB;
