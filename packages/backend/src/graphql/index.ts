import {RequestWithUser, ReservationStatus, UserRole} from "../types";
import User from '../models/user';
import bcrypt from "bcryptjs";
import express from "express";
import {ApolloServer, BaseContext} from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as http from "node:http";
import {ReservStatus, UserRoles} from "../constants";
import Reservation from "../models/reservation";

interface ApolloContext extends BaseContext{
    userId: string;
    role: UserRole
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
  }
`;

const resolvers = {
    Query: {
        reservations: async (
            _: never,
            { userId, arrivalTime, status }: {
                userId?: string, arrivalTime?: string, status?: ReservationStatus
            },
            context: ApolloContext
        ) => {
            const queryConditions: {
                guestId?: string
                status?: ReservationStatus
                arrivalTime?: string
            } = {};

            if (userId) queryConditions.guestId = userId;
            if (status) queryConditions.status = status;
            if (arrivalTime) queryConditions.arrivalTime = arrivalTime;

            let reservations = await Reservation.find(queryConditions);

            if (context.role === UserRoles.GUEST) {
                reservations = reservations.filter(
                    (reservation: { status: string }) => reservation.status !== ReservStatus.CANCELLED
                );
            }

            return reservations;
        }
    },
    Mutation: {
        createReservation: async (
            _: never,
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
            _: never,
            { id, guestName, guestContact, arrivalTime, tableSize, status }:
                {
                    id: string, guestName?: string, guestContact?: string,
                    arrivalTime?: string, tableSize?: number, status?: string
                }
        ) => {
            return Reservation.findByIdAndUpdate(
                id, { guestName, guestContact, arrivalTime, tableSize, status }, { new: true }
            );
        }
    }
};

export const setupGraphQL = async (app: express.Application) => {
    const httpServer = http.createServer(app);
    const server = new ApolloServer<ApolloContext>({
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
                role: request.role,
            };
        }
    }));
};
