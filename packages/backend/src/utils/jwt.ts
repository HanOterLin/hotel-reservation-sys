import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

export const signToken = (payload: object, expiresIn: string | number = '24h'): string => {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, JWT_SECRET_KEY);
};
