import { gql } from '@apollo/client';

export const CREATE_RESERVATION = gql`
  mutation CreateReservation(
    $guestName: String!,
    $guestContact: String!,
    $arrivalTime: String!,
    $tableSize: Int!
  ) {
    createReservation(
      guestName: $guestName,
      guestContact: $guestContact,
      arrivalTime: $arrivalTime,
      tableSize: $tableSize
    ) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: ID!, $guestName: String!, $guestContact: String!, $arrivalTime: String!, $tableSize: Int!, $status: String!) {
    updateReservation(id: $id, guestName: $guestName, guestContact: $guestContact, arrivalTime: $arrivalTime, tableSize: $tableSize, status: $status) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;
