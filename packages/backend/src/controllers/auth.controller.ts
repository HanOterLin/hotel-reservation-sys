import { Request, Response } from 'express';
import User from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/hash_password';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const hashedPassword = hashPassword(password);

    try {
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
    } catch (err) {
        res.status(500).send({ message: (err as Error).message });
    }

    login(req, res);
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const passwordIsValid = comparePassword(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: 'Invalid password' });

        const token = signToken({ userId: user._id, role: user.role });

        res.setHeader('Authorization', token);
        res.status(200).send({ username: user.username, role: user.role, accessToken: token });
    } catch (err) {
        res.status(403).send({ message: (err as Error).message });
    }
};
