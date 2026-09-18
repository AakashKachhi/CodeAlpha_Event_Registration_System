# Event Registration System

A backend Event Registration System built with Node.js, Express.js, MongoDB, and Mongoose. The system provides authentication, role-based event creation, event browsing, event registration, registration cancellation, and user registration history.

## Features

- User registration
- User login with JWT authentication
- Password hashing with bcrypt
- Protected routes using JWT middleware
- User profile
- Role-based authorization
- Organizer-only event creation
- Get all events
- Get event details by ID
- Register for an event
- Prevent duplicate event registrations
- Event capacity management
- View user's registered events
- Cancel event registration
- MongoDB database integration
- Input validation using Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv

## Project Structure

```text
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