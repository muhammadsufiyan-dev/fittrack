# FitTrack - server

This is the Express API of FitTrack. It handles login, all the fitness data and the community, and it saves everything in MongoDB Atlas using Mongoose.

All the endpoints are listed in `docs/API.md`.

## Tech used

- Node.js and Express
- MongoDB Atlas with Mongoose
- JWT for login and bcrypt for passwords
- google-auth-library to check Google sign-in
- Nodemailer with Gmail for verification and reset emails
- helmet, CORS and express-rate-limit for security

## Folder structure

    src
    |-- config         environment values and the database connection
    |-- controllers    the logic for each feature
    |-- middleware     login check, validation, rate limits and error handling
    |-- models         Mongoose models
    |-- routes         the API routes
    |-- utils          helpers like dates and emails
    tests              automated tests
    docs               API.md

## Setup

    npm install
    copy .env.example .env

Open `.env` and fill these values:

    MONGO_URI=your Atlas connection string
    PORT=5000
    JWT_SECRET=any long random text (at least 32 characters)
    CLIENT_URL=http://localhost:5173
    APP_URL=http://localhost:5173/fittrack

These are optional:

    MAIL_USER=your Gmail address
    MAIL_PASS=a Gmail app password
    GOOGLE_CLIENT_ID=your Google OAuth ID

Without `MAIL_USER` and `MAIL_PASS`, no real email is sent. The verification and reset links are printed in this terminal instead.

## Commands

    npm run dev      start with auto restart
    npm start        start normally
    npm test         run the tests

The tests use a separate database called fittrack_test, so your real data is never touched.