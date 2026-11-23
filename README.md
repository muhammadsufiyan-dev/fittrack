# FitTrack

FitTrack is a fitness tracker web app. You can log your workouts and meals, track your weight, set goals, get reminders and see your progress in charts. It also has a small community where members can post and follow each other.

I made this as my Aptech Software Engineering eProject using the MERN stack (MongoDB, Express, React and Node).

## Live links

- Website: https://muhammadsufiyan-dev.github.io/fittrack/
- API: https://fittrack-backend-rouge.vercel.app/api

The first request can be a little slow because the server and database wake up after some idle time.

## Demo account

    Email: demo@fittrack.com
    Password: Demo@123

You can also click "Use demo account" on the login page.

## What you can do

- Register, log in and edit your profile
- Add, edit and delete workouts
- Log meals and see calories and macros
- Track your weight and body progress
- Set goals and see how close you are
- Set reminders for workouts and meals
- See charts and analytics for your week
- Download reports as CSV
- Search across your workouts, meals and goals
- Post in the community, reply, like and follow other members
- Get notifications for goals, reminders and followers
- Change units, theme and notification settings
- Export or clear your data and delete your account
- Contact support from the help page

## Tech used

- Frontend: React, Vite, React Router, Bootstrap, Recharts
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Login: JWT tokens and bcrypt for passwords
- Security: helmet, CORS and rate limiting
- Hosting: GitHub Pages for the frontend, Vercel for the backend

## Folder structure

    fittrack
    |-- client        React frontend
    |   |-- public
    |   `-- src
    |       |-- components
    |       |-- context
    |       |-- pages
    |       |-- services      API calls
    |       |-- styles
    |       `-- utils
    |-- server        Express backend
    |   |-- api           Vercel entry file
    |   |-- docs          API.md with all the endpoints
    |   |-- scripts       seed script
    |   |-- src
    |   |   |-- controllers
    |   |   |-- middleware
    |   |   |-- models
    |   |   |-- routes
    |   |   `-- utils
    |   `-- tests
    `-- .github/workflows   auto deploy for the frontend

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

Then start the server:

    npm run dev

To add the demo account and some sample data:

    npm run seed

### 2. Frontend

Open a second terminal.

    cd client
    npm install
    copy .env.example .env
    npm run dev

Now open http://localhost:5173/fittrack/ in your browser.

## Tests

The backend has automated tests. They use a separate database called fittrack_test, so your real data is safe.

    cd server
    npm test

## API

All the endpoints are listed in `server/docs/API.md`.

## Deployment

- The frontend is built and deployed by GitHub Actions every time I push to main.
- The backend is deployed on Vercel from the `server` folder.
- The secrets (database link and JWT secret) are set in the Vercel settings and are not in the code.

## Author

Muhammad Sufiyan Shahid, Karachi, Pakistan