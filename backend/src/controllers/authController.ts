import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const secret = 'secret_key';

/**
 * Handle user registration (only guest)
 * @param {Request} req - The Express request object containing the user's registration information
 * @param {Response} res - The Express response object to send a response to the user's registration request
 */
export const register = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
    } catch (err) {
        res.status(500).send({ message: (err as Error).message });
    }

    login(req, res);
};

/**
 * Handle user login
 * @param {Request} req - The Express request object containing the user's login information
 * @param {Response} res - The Express response object to send a response to the user's login request
 */
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: 'Invalid password' });

        const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: 24 * 60 * 60 });

        res.setHeader('Authorization', token);
        res.status(200).send({ id: user._id, username: user.username, role: user.role, accessToken: token });
    } catch (err) {
        res.status(500).send({ message: (err as Error).message });
    }
};
