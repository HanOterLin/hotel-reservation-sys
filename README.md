# Hotel Restaurants Reservation System

## Project Overview
The Hotel Restaurants Reservation System is a single-page application built using React, Apollo Client, and GraphQL. Users can register and log in to the system and manage reservations based on their roles (guest or restaurant employee).

## Key Features
- **User Registration and Authentication:** Allows users to register and log in to the system.
- **Guest Capabilities:** Guests can create, view, update, and cancel their reservations.
- **Employee Capabilities:** Restaurant employees can browse, update, and manage all reservations.

## Tech Stack
- **Frontend:** React, TypeScript
- **State Management and Data Fetching:** Apollo Client, GraphQL
- **Styling:** Material-UI
- **Routing:** React Router

## One-Time Installation

1. **Clone the Project Repository:**
    ```bash
    git clone https://github.com/HanOterLin/hotel-reservation-sys.git
    cd hotel-reservation-sys
    ```

2. **Build Images and Run:**
    ```bash
    docker compose up
    ```
   The project will be available at `http://localhost:3000`.

## Separate Installation (For Debugging)

### Prerequisites
- **Node.js:** Version 20.x
- **MongoDB:** Installed and running (using Docker or locally)

### Installation Steps

1. **Run MongoDB Container:**
    ```bash
    docker run --name my-mongo -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d -p 27017:27017 mongo
    ```

2. **Clone the Project Repository:**
    ```bash
    git clone https://github.com/HanOterLin/hotel-reservation-sys.git
    cd hotel-reservation-sys
    ```

3. **Install Dependencies:**
    ```bash
    npm config set registry https://registry.npmmirror.com
    npm i pnpm install -g
    pnpm -r install
    ```

4. **Start the Project:**
    ```bash
    pnpm -r run start
    ```
   The project will be available at `http://localhost:3000`.
