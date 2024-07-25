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

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        role
      }
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      user {
        id
        username
        role
      }
      accessToken
    }
  }
`;