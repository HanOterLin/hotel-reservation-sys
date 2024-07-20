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
  mutation UpdateReservation($id: ID!, $guestName: String!, $guestContact: String!, $arrivalTime: String!, $tableSize: String!) {
    updateReservation(id: $id, guestName: $guestName, guestContact: $guestContact, arrivalTime: $arrivalTime, tableSize: $tableSize) {
      id
      guestName
      guestContact
      arrivalTime
      tableSize
      status
    }
  }
`;

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id) {
      id
    }
  }
`;

export const MARK_RESERVATION = gql`
  mutation MarkReservation($id: ID!, $status: String!) {
    markReservation(id: $id, status: $status) {
      id
      status
    }
  }
`;
