import {RequestWithUser} from "../types";
import User from '../models/user';
import RefreshToken from '../models/refreshToken';
import Reservation from '../models/reservation';
import bcrypt from "bcryptjs";
import express, {Request, Response} from "express";
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import * as http from "node:http";
import jwt from "jsonwebtoken";

interface ApolloContext {
    userId: string;
}

const SECRET_KEY = 'secret_key';
const REFRESH_SECRET_KEY = 'refresh_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    role: String!
  }
  
  type AuthPayload {
    user: User!
    accessToken: String!
  }

  type Reservation {
    id: ID!
    guestName: String!
    guestContact: String!
    arrivalTime: String!
    tableSize: Int!
    status: String!
  }

  type Query {
    users: [User]
    reservations(userId: ID = null, arrivalTime: String, status: String): [Reservation]
  }

  type Mutation {
    createReservation(
      guestName: String!,
      guestContact: String!,
      arrivalTime: String!,
      tableSize: Int!
    ): Reservation
    updateReservation(
      id: ID!,
      guestName: String,
      guestContact: String,
      arrivalTime: String,
      tableSize: Int,
      status: String
    ): Reservation
    login(username: String!, password: String!): AuthPayload
    register(username: String!, password: String!): AuthPayload
    refreshToken: String
    verifyToken(token: String!): Boolean
  }
`;

const resolvers = {
    Query: {
        users: async () => await User.find(),
        reservations: async (_: void, {userId, arrivalTime, status}: {
            userId?: string,
            arrivalTime?: string,
            status?: string
        }) => {
            let result = [];
            const opts = {};
            if (userId) {
                Object.assign(opts, {guestId: userId});
            }
            if (status) {
                Object.assign(opts, {status});
            }
            if (arrivalTime) {
                Object.assign(opts, {arrivalTime});
            }

            result = await Reservation.find(opts);

            return result;
        },
    },
    Mutation: {
        register: async (
            _: void,
            {username, password}: { username: string, password: string, role: string },
            {res}: { res: Response }
        ) => {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw new Error('Username already taken');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({username, password: hashedPassword, role: 'guest'});

            const accessToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRY});
            const refreshToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, REFRESH_SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRY});

            // Save refresh token to database
            const newRefreshToken = new RefreshToken({
                token: refreshToken,
                userId: user.id,
                expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS) // 7 days
            });
            await newRefreshToken.save();

            res.cookie('refreshToken', refreshToken, {
                maxAge: REFRESH_TOKEN_EXPIRY_MS,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });

            return {user: {id: user._id, username: user.username, role: user.role}, accessToken};
        },
        login: async (
            _: void,
            {username, password}: { username: string, password: string, role: string },
            {res}: { res: Response }
        ) => {
            const user = await User.findOne({username});
            if (!user) throw new Error('404');

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) throw new Error('401');

            const accessToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRY});
            const refreshToken = jwt.sign({
                userId: user._id,
                role: user.role
            }, REFRESH_SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRY});

            // Save refresh token to database
            const newRefreshToken = new RefreshToken({
                token: refreshToken,
                userId: user.id,
                expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS) // 7 days
            });
            await newRefreshToken.save();

            res.cookie('refreshToken', refreshToken, {
                maxAge: REFRESH_TOKEN_EXPIRY_MS,
                secure: true,
                httpOnly: true,
                sameSite: 'strict'
            });

            return {user: {id: user._id, username: user.username, role: user.role}, accessToken};
        },
        refreshToken: async (_: void, __: void, {req, res}: { req: Request, res: Response }) => {
            const {refreshToken} = req.cookies;

            if (!refreshToken) throw new Error('No refresh token provided');

            const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as { id: string, username: string };

            const tokenDoc = await RefreshToken.findOne({token: refreshToken, userId: decoded.id});
            if (!tokenDoc || tokenDoc.expires < new Date()) throw new Error('Invalid or expired refresh token');

            const newAccessToken = jwt.sign({
                id: decoded.id,
                username: decoded.username
            }, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRY});
            const newRefreshToken = jwt.sign({
                id: decoded.id,
                username: decoded.username
            }, REFRESH_SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRY});

            tokenDoc.token = newRefreshToken;
            tokenDoc.expires = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
            await tokenDoc.save();

            res.setHeader('Authorization', `Bearer ${newAccessToken}`);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: REFRESH_TOKEN_EXPIRY_MS,
            });

            return newAccessToken;

        },
        createReservation: async (
            _: void,
            {guestName, guestContact, arrivalTime, tableSize}:
                { guestName: string, guestContact: string, arrivalTime: string, tableSize: number },
            context: ApolloContext
        ) => {
            const newReservation = new Reservation({
                guestId: context.userId,
                guestName,
                guestContact,
                arrivalTime,
                tableSize,
                status: 'pending'
            });
            await newReservation.save();
            return newReservation;
        },
        updateReservation: async (
            _: void,
            {id, guestName, guestContact, arrivalTime, tableSize, status}:
                {
                    id: string,
                    guestName?: string,
                    guestContact?: string,
                    arrivalTime?: string,
                    tableSize?: number,
                    status?: string
                }
        ) => {
            return Reservation.findByIdAndUpdate(
                id, {guestName, guestContact, arrivalTime, tableSize, status}, {new: true}
            );
        },
        verifyToken: async (_: void, { token }: { token: string }) => {
            try {
                const decoded = await jwt.verify(token, SECRET_KEY) as { id: string, role: string };
                return decoded ? true : false;
            } catch (err) {
                return false;
            }
        }
    }
};

export const setupGraphQL = async (app: express.Application) => {
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        formatError: (formattedError) => {
            return formattedError;
        },
    });

    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            const request = req as RequestWithUser;
            const token = req.headers.authorization?.split(' ')[1];
            let userId;
            let userRole;

            if (token) {
                try {
                    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string, role: string };
                    userId = decoded.userId;
                    userRole = decoded.role;
                } catch (err) {
                    throw new Error('UNAUTHENTICATED');
                }
            }

            return {
                req: request,
                res,
                userId,
                userRole,
            };
        }
    }));
};
