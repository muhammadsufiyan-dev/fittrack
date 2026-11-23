# FitTrack Server

REST API for the FitTrack fitness tracker. Built with Node.js, Express, MongoDB Atlas and Mongoose.

## Features

- Sign up and log in with JWT tokens and hashed passwords
- Workouts, meals, body progress, goals and reminders for each member
- Dashboard, analytics, printable reports and CSV download
- Search across your own records and other members
- Community posts, likes, replies and follows
- Support messages, data export and data clear
- Account deletion that removes all of the member's data

## Setup

You need Node.js 18 or newer and a MongoDB Atlas cluster.

```
npm install
```

Create a `.env` file in this folder (see `.env.example`):

| Name | Description |
| --- | --- |
| `PORT` | Port to listen on (default `5000`) |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | Long random secret, at least 32 characters |
| `CLIENT_URL` | Allowed website addresses, separated by commas |

Make a secret with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Run

```
npm run dev     # restarts when files change
npm start       # normal start
npm test        # automated tests
```

Check it works: open `http://localhost:5000/api/health`.

## Tests

`npm test` runs unit tests and API tests with Node's built-in test runner. The API tests use a separate database called `fittrack_test` on the same cluster and clear it before and after the run. They refuse to delete anything from another database.

## Folder structure

```
src/
  config/       environment and database connection
  controllers/  request handling for each feature
  middleware/   auth check, rate limits, error handling
  models/       Mongoose schemas
  routes/       URL to controller mapping
  utils/        small helpers (validation, dates, tokens)
  app.js        Express setup
  server.js     starts the server
tests/          unit and API tests
docs/API.md     every endpoint
```

## Security

- Passwords are hashed with bcrypt and never returned by the API
- Tokens are signed with HS256 and expire after 7 days
- Every query is limited to the logged in member
- Input is checked and trimmed before saving, and query values are forced to strings
- Helmet security headers, CORS limited to `CLIENT_URL`, a 2 MB body limit and rate limits
- `.env` is never committed

See `docs/API.md` for the full endpoint list.
