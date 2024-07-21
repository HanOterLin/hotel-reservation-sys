import { RequestWithUser } from "../types";
import User from '../models/user';
import Reservation from '../models/reservation';
import bcrypt from "bcryptjs";
import express from "express";
import {ApolloServer} from '@apollo/server';
import { expressMiddleware} from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as http from "node:http";

interface ApolloContext {
    userId: string;
}

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    role: String!
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
    createUser(username: String!, password: String!, role: String!): User
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
  }
`;

const resolvers = {
    Query: {
        users: async () => await User.find(),
        reservations: async (_: void, { userId, arrivalTime, status }: { userId?: string, arrivalTime?: string, status?: string }) => {
            let result = [];
            const opts = {};
            if(userId){
                Object.assign(opts, { guestId: userId });
            }
            if(status){
                Object.assign(opts, { status });
            }
            if(arrivalTime){
                Object.assign(opts, { arrivalTime });
            }

            result = await Reservation.find(opts);
            
            return result;
        },
    },
    Mutation: {
        createUser: async (
            _: void,
            { username, password, role }: { username: string, password: string, role: string }
        ) => {
            const hashedPassword = bcrypt.hashSync(password, 8);
            const newUser = new User({ username, password: hashedPassword, role });
            await newUser.save();
            return newUser;
        },
        createReservation: async (
            _: void,
            { guestName, guestContact, arrivalTime, tableSize }:
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
            { id, guestName, guestContact, arrivalTime, tableSize, status }:
                { id: string, guestName?: string, guestContact?: string, arrivalTime?: string, tableSize?: number, status?: string }
        ) => {
            return Reservation.findByIdAndUpdate(
                id, { guestName, guestContact, arrivalTime, tableSize, status }, { new: true }
            );
        }
    }
};

export const setupGraphQL = async (app: express.Application) => {
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        formatError: (formattedError) => {
            return formattedError;
        },
    });

    await server.start();
    app.use(expressMiddleware(server, {
        context: async ({ req }) => {
            const request = req as RequestWithUser;
            return {
                userId: request.userId,
            };
        }
    }));
};
