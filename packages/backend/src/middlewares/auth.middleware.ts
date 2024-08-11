import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

/**
 * Verify the token and extract user information
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authentication'] as string;

    if (!token) return res.status(403).send({ message: 'No token provided' });

    let jwtPayload;
    try {
        const tokenWithoutBearer = token.split(' ')[1];
        jwtPayload = verifyToken(tokenWithoutBearer) as JwtPayload;
    } catch (err) {
        return res.status(403).send({ message: 'Failed to authenticate token' });
    }

    if (!jwtPayload) return res.status(403).send({ message: 'No token provided' });

    Object.assign(req, jwtPayload);

    next();
};
