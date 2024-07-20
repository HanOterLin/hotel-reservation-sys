import { gql } from '@apollo/client';

export const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

export const GET_USER_RESERVATIONS = gql`
  query GetUserReservations($userId: ID!) {
    userReservations(userId: $userId) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;
