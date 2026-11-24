# FitTrack

FitTrack is a fitness tracker web app. You can log your workouts and meals, track your weight, set goals, get reminders and see your progress in charts. It also has a small community where members can post and follow each other.

Made with the MERN stack (MongoDB, Express, React and Node) as an Aptech Software Engineering eProject.

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
- Send a message from the support page

## User guide

### 1. Create an account and log in

1. Open the website and click Get started.
2. Enter your name, email and a password (8 characters with a letter and a number), accept the privacy policy and register.
3. A verification email arrives in your inbox. Open the link in it, then log in. You cannot log in before the email is verified.
4. You can also use Continue with Google, which needs no verification.
5. If you forget your password, click Forgot password on the login page. A reset link arrives by email and works for 30 minutes. When you are logged in, you can change your password from Settings.

### 2. Dashboard

The first page after login. It shows your stats, the weekly chart, your calories and macros, your goals and your latest workouts. The search box on top finds your workouts, meals, goals and other members.

### 3. Workouts

Click Add workout and enter the name, category, date, duration and calories. You can add exercises with sets, reps and weight. Open a workout to see its details, and edit or delete it from there.

### 4. Nutrition

Add a meal for a day (breakfast, lunch, dinner or snack) with its food items. Calories, protein, carbs and fats are added up for each day.

### 5. Progress

Save your weight, body fat and body measurements. The chart shows how they change over time.

### 6. Goals

Create a goal with a start value, a target and a deadline. The progress bar fills automatically from the data you log, so there is nothing to update by hand.

### 7. Reminders

Set a reminder for a workout, meal, water or weigh-in. Choose the time and the days of the week, and switch it on or off whenever you like.

### 8. Analytics and reports

Analytics shows charts for the last 7, 30 or 90 days. Reports gives you a summary that you can print, save as PDF or download as CSV.

### 9. Community

Share a post under a topic, and edit it later if you need to. You can like and comment on other posts, follow members and open their profiles. On your own post you can delete any comment, and every member can delete their own comments.

### 10. Notifications and FitBot

The bell shows new followers, replies to your posts, goal progress and reminders. You can mark them as read or dismiss them. FitBot is the chat assistant inside the dashboard. Ask it about your own data, about any page or for fitness tips.

### 11. Profile and settings

Edit your name, city, bio and photo from Profile. You can choose whether other members can find you. Settings has the theme (light or dark), units, notifications, change password, data export, clearing your data and deleting your account.

### 12. Support

Open Support from the menu, choose a type, write a subject and a message and click Send message. It is saved under Your messages and emailed to the support inbox.
## Tech used

- Frontend: React, Vite, React Router, Bootstrap, Recharts
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Login: JWT tokens, bcrypt for passwords and Google sign-in
- Emails: Nodemailer with Gmail
- Support form: Formspree
- Security: helmet, CORS and rate limiting

## How it is connected

- The React frontend talks to the Express API with JSON requests. After login, every request carries the JWT token in the Authorization header.
- The API is connected to MongoDB Atlas through Mongoose. Users, workouts, meals, progress, goals, reminders, settings, community posts, follows, support messages and notification states are each stored in their own collection.
- Passwords are hashed with bcrypt. Verification and reset links are sent with Nodemailer through a Gmail account.
- Google sign-in gives the frontend an ID token, and the API checks it with Google before logging the user in.
- A support message is saved in MongoDB, so the user can see it in "Your messages", and the same message is sent to Formspree, which emails it to the support inbox.

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

You need Node.js and a free MongoDB Atlas cluster.

### 1. Backend

    cd server
    npm install
    copy .env.example .env

Open the new `.env` file and fill these values:

    MONGO_URI=your Atlas connection string
    PORT=5000
    JWT_SECRET=any long random text (at least 32 characters)
    CLIENT_URL=http://localhost:5173
    APP_URL=http://localhost:5173/fittrack

These are optional:

    MAIL_USER=your Gmail address
    MAIL_PASS=a Gmail app password
    GOOGLE_CLIENT_ID=your Google OAuth ID

Without `MAIL_USER` and `MAIL_PASS`, no real email is sent. The verification and reset links are printed in the backend terminal instead, so you can copy the link from there and open it in the browser.

Then start the API:

    npm run dev

### 2. Frontend

Open a second terminal.

    cd client
    npm install
    copy .env.example .env
    npm run dev

The frontend `.env` has these values:

    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your Google OAuth ID (optional)
    VITE_FORMSPREE_ID=your Formspree form ID (optional)

Now open http://localhost:5173/fittrack/ in your browser.

## Tests

The backend has automated tests. They use a separate database called fittrack_test, so your real data is safe.

    cd server
    npm test

## API

All the endpoints are listed in `server/docs/API.md`.