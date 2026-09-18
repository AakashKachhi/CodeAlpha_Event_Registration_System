# Event Registration System

A backend Event Registration System built with **Node.js, Express.js, MongoDB, and Mongoose**. The system allows users to register and log in, browse events, register for events, view their registrations, and cancel registrations. Organizers can create events.

## Features

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* User Profile
* Role-Based Authorization
* Organizer-only Event Creation
* Get All Events
* Get Event by ID
* Register for an Event
* Duplicate Registration Prevention
* Event Capacity Management
* View User Registrations
* Cancel Event Registration
* MongoDB Database Integration
* Mongoose Validation

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt
* dotenv

## User Roles

### User

A normal user can:

* Create an account
* Login
* View their profile
* View available events
* View event details
* Register for an event
* View their registered events
* Cancel their registration

### Organizer

An organizer can:

* Perform all normal user operations
* Create events

## API Endpoints

### Authentication

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Register a new user          |
| POST   | `/api/auth/login`    | Login user                   |
| GET    | `/api/auth/profile`  | Get logged-in user's profile |

### Events

| Method | Endpoint                       | Description        |
| ------ | ------------------------------ | ------------------ |
| POST   | `/api/event/createEvent`       | Create a new event |
| GET    | `/api/event/getAllEvent`       | Get all events     |
| GET    | `/api/event/getEvent/:eventId` | Get event by ID    |

### Event Registration

| Method | Endpoint                                        | Description               |
| ------ | ----------------------------------------------- | ------------------------- |
| POST   | `/api/register/registerForEvent/:eventId`       | Register for an event     |
| GET    | `/api/register/getUserEvent`                    | Get user's registrations  |
| DELETE | `/api/register/cancelUserRegistration/:eventId` | Cancel event registration |

## Authentication

The application uses **JWT-based authentication**.

After a successful login, the API returns a JWT token. For protected endpoints, include the token in the request header:

`Authorization: Bearer YOUR_JWT_TOKEN`

Protected endpoints:

* `GET /api/auth/profile`
* `POST /api/event/createEvent`
* `POST /api/register/registerForEvent/:eventId`
* `GET /api/register/getUserEvent`
* `DELETE /api/register/cancelUserRegistration/:eventId`

Event creation additionally requires the authenticated user to have the `organizer` role.

## Event Fields

| Field       | Type   | Required |
| ----------- | ------ | -------- |
| eventName   | String | Yes      |
| date        | Date   | Yes      |
| location    | String | Yes      |
| description | String | Yes      |
| capacity    | Number | Yes      |

The event capacity must be at least `1`.

## Registration Rules

A user can register for an event only if:

* The user exists
* The event exists
* The event has available capacity
* The user has not already registered for that event

A unique compound index on `user` and `event` is used to prevent duplicate registrations at the database level.

## Database Models

### User

* Display Name
* Username
* Email
* Hashed Password
* Role

### Event

* Event Name
* Date
* Location
* Description
* Capacity

### Registration

* User Reference
* Event Reference
* Registration Date

## Project Structure

```
Event-Registration-System/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   ├── profile.controller.js
│   │   └── registration.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   └── registration.model.js
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── event.route.js
│   │   └── registration.route.js
│   │
│   └── services/
│       ├── auth.service.js
│       ├── event.service.js
│       ├── profile.service.js
│       └── registration.service.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` or secret credentials to GitHub.

## Installation

1. Clone the repository.

   ```
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory.

   ```
   cd Event-Registration-System
   ```

3. Install dependencies.

   ```
   npm install
   ```

4. Create a `.env` file and add the required environment variables.

5. Start the development server.

   ```
   npm run dev
   ```

   Or:

   ```
   npm start
   ```

The server will run on:

```
http://localhost:5001
```

## Testing

The API was tested using **Postman**.

Tested functionality includes:

* User registration
* User login
* JWT authentication
* Protected routes
* User profile
* Organizer authorization
* Event creation
* Get all events
* Get event by ID
* Event registration
* Duplicate registration prevention
* Event capacity restriction
* Get user registrations
* Cancel registration
* Registration not found handling
* Invalid and expired token handling

## Error Handling

The API handles common errors including:

* Missing required fields
* Missing authentication token
* Invalid authorization format
* Invalid or expired JWT
* Unauthorized access
* Invalid user
* User not found
* Event not found
* Duplicate registration
* Event capacity reached
* Registration not found
* Database/server errors

## CodeAlpha Internship

This project was developed as **Task 2 — Event Registration System** for the **CodeAlpha Backend Development Internship**.

## Author

**Aakash Kachhi**

GitHub: [https://github.com/AakashKachhi](https://github.com/AakashKachhi)

LinkedIn: [https://www.linkedin.com/in/aakash-kachhi/](https://www.linkedin.com/in/aakash-kachhi/)
