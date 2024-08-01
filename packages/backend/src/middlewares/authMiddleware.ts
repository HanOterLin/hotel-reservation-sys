import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const secret: Secret = 'secret_key';

/**
 * Verify the token and extract user information
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authentication'] as string;

    if (!token) return res.status(403).send({ message: 'No token provided' });

    let jwtPayload;
    try {
        const tokenWithoutBearer = token.split(' ')[1];
        jwtPayload = jwt.verify(tokenWithoutBearer, secret) as JwtPayload;
    } catch (err) {
        return res.status(403).send({ message: 'Failed to authenticate token' });
    }

    if (!jwtPayload) return res.status(403).send({ message: 'No token provided' });

    Object.assign(req, jwtPayload);

    next();
};
