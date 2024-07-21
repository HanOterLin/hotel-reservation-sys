import { gql } from '@apollo/client';

export const GET_RESERVATIONS = gql`
  query GetReservations($userId: ID = null, $arrivalTime: String, $status: String) {
    reservations(userId: $userId, arrivalTime: $arrivalTime, status: $status) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;
