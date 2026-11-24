# FitTrack API

Base URL on your computer: `http://localhost:5000/api`

- Every endpoint needs the header `Authorization: Bearer <token>`, except the ones under "Sign up and log in" and `GET /health`.
- Errors always come back as `{ "message": "..." }`.
- Dates are `YYYY-MM-DD` and times are `HH:MM`.
- Endpoints that depend on "today" accept `?today=YYYY-MM-DD`, because the server runs in UTC.
- Status codes: 400 wrong input, 401 not logged in, 403 not allowed, 404 not found, 409 already exists, 429 too many requests.

## Sign up and log in

| Method | Path | Body | What it does |
|---|---|---|---|
| POST | /auth/register | name, email, password, photo (optional), consent: true | Creates the account and emails a verification link. Nobody can log in before the email is verified |
| POST | /auth/verify-email | email, token | Verifies the email and returns `{ token, user }` |
| POST | /auth/resend-verification | email | Sends a new verification link |
| POST | /auth/login | email, password | Returns `{ token, user }`. Gives 403 if the email is not verified |
| POST | /auth/google | credential | Logs in with a Google ID token. Creates the account on first use |
| POST | /auth/forgot-password | email | Emails a reset link that works for 30 minutes |
| POST | /auth/reset-password | email, token, password | Sets a new password using the link |
| PUT | /auth/password | currentPassword, newPassword | Changes the password. Needs login. Returns a new token and logs out other devices |
| GET | /auth/me | | Returns the logged in user |

A password needs at least 8 characters with a letter and a number.

## Account

| Method | Path | Body | What it does |
|---|---|---|---|
| PUT | /users/me | name, phone, city, bio, photo, discoverable | Updates the profile |
| GET | /users/:id | | Shows a member profile |
| DELETE | /users/me | | Deletes the account and everything stored with it |
| GET | /settings | | Returns theme, units and notification settings |
| PUT | /settings | theme, units, notify | Saves the settings |

## Workouts, meals, progress, goals and reminders

Each of these has the same five endpoints:

| Method | Path | What it does |
|---|---|---|
| GET | /{name} | List (newest first) |
| POST | /{name} | Create |
| GET | /{name}/:id | One record |
| PUT | /{name}/:id | Update |
| DELETE | /{name}/:id | Delete |

| Name | Path | Fields |
|---|---|---|
| Workouts | /workouts | name, category (Strength, Cardio, HIIT, Flexibility), date, duration, calories, notes, tags, exercises (name, sets, reps, weight) |
| Meals | /nutrition | date, mealType (Breakfast, Lunch, Dinner, Snack), notes, items (name, calories, protein, carbs, fats). List accepts `?date=` |
| Progress | /progress | date, weight, bodyFat, waist, chest, hips |
| Goals | /goals | title, type (weight, workouts, custom), start, target, current, unit, deadline. The server adds `current` and `percent` |
| Reminders | /reminders | title, type (workout, meal, water, weigh, custom), time, days (0 to 6), enabled, note |

## Dashboard, analytics and reports

| Method | Path | What it does |
|---|---|---|
| GET | /dashboard | Stats, weekly chart, macros, goals and recent workouts |
| GET | /analytics?days=30 | Totals and chart data for the last 1 to 365 days |
| GET | /reports?days=30 | Report for the last 1 to 365 days |
| GET | /reports/csv?days=30 | The same report as a CSV file |
| GET | /search?q=text | Searches workouts, meals and goals (and members who allow it) |

## Community

| Method | Path | Body | What it does |
|---|---|---|---|
| GET | /community/posts | | All posts. `?author=<id>` shows one member's posts |
| POST | /community/posts | topic, title, body | Creates a post |
| PUT | /community/posts/:id | topic, title, body | Edits your own post |
| DELETE | /community/posts/:id | | Deletes your own post |
| POST | /community/posts/:id/like | | Likes or unlikes |
| POST | /community/posts/:id/replies | text | Adds a comment |
| DELETE | /community/posts/:id/replies/:replyId | | Removes a comment. Allowed for the comment writer and the post owner |
| GET | /community/people | | Members with follower and post counts |
| GET | /community/following | | Ids of the members you follow |
| GET | /community/followers | | Members who follow you |
| POST | /community/follow/:id | | Follow a member |
| DELETE | /community/follow/:id | | Unfollow |
| GET | /community/members/:id/stats | | Posts, comments and likes of a member |
| GET | /community/stats | | Totals for the whole community |
| GET | /community/contributors | | Most active members |
| GET | /community/alerts | | New followers and replies for you |

Topics are workouts, nutrition, progress, motivation and questions.

## Notifications, support and data

| Method | Path | Body | What it does |
|---|---|---|---|
| GET | /notifications | | Ids you have read or dismissed |
| POST | /notifications/read | ids | Marks notifications as read |
| POST | /notifications/dismiss | ids | Hides notifications |
| GET | /support | | Your messages to support |
| POST | /support | type (question, issue, feedback), subject, message | Sends a message |
| DELETE | /support/:id | | Deletes a message |
| GET | /data/export | | Downloads all your data |
| DELETE | /data | | Clears your workouts, meals, progress, goals and reminders |
| GET | /health | | Returns `{ status: "ok" }` |