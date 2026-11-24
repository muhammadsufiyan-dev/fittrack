# FitTrack

FitTrack is a fitness tracker web app. You can log your workouts and meals, track your weight, set goals, get reminders and see your progress in charts. It also has a small community where members can post and follow each other.

I made this as my Aptech Software Engineering eProject using the MERN stack (MongoDB, Express, React and Node).

## Live website

https://muhammadsufiyan-dev.github.io/fittrack/

## What you can do

- Create an account, verify your email and log in (or continue with Google)
- Change your password, or reset it by email if you forget it
- Add, edit and delete workouts
- Log meals and see calories and macros
- Track your weight and body progress
- Set goals and see how close you are
- Set reminders for workouts and meals
- See charts and analytics for your week
- Download reports as CSV
- Search across your workouts, meals and goals
- Post in the community, edit your posts, reply, like and follow other members
- Delete comments on your own posts
- Get notifications for goals, reminders and followers
- Change units, theme and notification settings
- Export or clear your data and delete your account
- Contact support from the help page

## Tech used

- Frontend: React, Vite, React Router, Bootstrap, Recharts
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Login: JWT tokens, bcrypt for passwords and Google sign-in
- Emails: Nodemailer
- Security: helmet, CORS and rate limiting

## Folder structure

    fittrack
    |-- client        React frontend
    |   |-- public
    |   `-- src
    |       |-- components
    |       |-- context
    |       |-- layouts
    |       |-- pages
    |       |-- routes
    |       |-- services      API calls
    |       |-- styles
    |       `-- utils
    `-- server        Express backend
        |-- docs          API.md with all the endpoints
        |-- src
        |   |-- config
        |   |-- controllers
        |   |-- middleware
        |   |-- models
        |   |-- routes
        |   `-- utils
        `-- tests

## Run it on your computer

You need Node.js and a MongoDB Atlas database (the free one is fine).

### 1. Backend

    cd server
    npm install
    copy .env.example .env

Open the new `.env` file and fill these values:

    MONGO_URI=your atlas connection string
    PORT=5000
    JWT_SECRET=any long random text (at least 32 characters)
    CLIENT_URL=http://localhost:5173
    APP_URL=http://localhost:5173/fittrack

These are optional:

    MAIL_USER=your Gmail address
    MAIL_PASS=a Gmail app password
    GOOGLE_CLIENT_ID=your Google OAuth client id

Without `MAIL_USER` and `MAIL_PASS`, no real email is sent. The verification and reset links are printed in the backend terminal instead, so you can copy the link from there and open it in the browser.

Then start the server:

    npm run dev

### 2. Frontend

Open a second terminal.

    cd client
    npm install
    copy .env.example .env
    npm run dev

If you use Google sign-in, put the same client id in `client/.env` as `VITE_GOOGLE_CLIENT_ID`.

Now open http://localhost:5173/fittrack/ in your browser.

## Tests

The backend has automated tests. They use a separate database called fittrack_test, so your real data is safe.

    cd server
    npm test

## API

All the endpoints are listed in `server/docs/API.md`.

## Author

Muhammad Sufiyan Shahid, Karachi, Pakistan