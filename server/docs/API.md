# FitTrack API

Base URL (local): `http://localhost:5000/api`

All responses are JSON. Every route except `/health`, `/auth/register` and `/auth/login` needs a token. Send it in the header `Authorization: Bearer <token>`.

## Conventions

- Dates are `YYYY-MM-DD` strings. Times are `HH:MM` (24 hour).
- The server runs in UTC, so routes that depend on "today" accept `?today=YYYY-MM-DD` from the client.
- Every record belongs to the logged in member. Other members' records return `404`.
- Lists return a named array (`workouts`, `logs`, `entries`, `goals`, `reminders`). A single record is returned under its singular name (`workout`, `log`, `entry`, `goal`, `reminder`).
- Records have an `id` string. `user`, `_id` and `__v` are never returned.

## Errors

Errors always look like `{ "message": "..." }`.

| Status | Meaning |
| --- | --- |
| 400 | Invalid input or invalid id |
| 401 | Missing, invalid or expired token, or the account no longer exists |
| 404 | Record not found (or it belongs to someone else) |
| 409 | Email already registered |
| 413 | Request body too large (limit 2 MB) |
| 429 | Too many requests |
| 500 | Server error |

## Rate limits

- All `/api` routes: 600 requests per 15 minutes per IP.
- `/auth/*`: 30 requests per 15 minutes per IP.
- `POST /support`: 10 requests per hour per IP.

## Health

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | `{ status: "ok", time }` |

## Auth

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| POST | `/auth/register` | `name` (2+ chars), `email`, `password` (8+ chars, a letter and a number), `consent: true`, optional `photo` | `201 { token, user }` |
| POST | `/auth/login` | `email`, `password` | `{ token, user }` |
| GET | `/auth/me` | - | `{ user }` |

Tokens expire after 7 days. `photo` must be a PNG, JPG or WebP data URL.

## Members

| Method | Path | Description |
| --- | --- | --- |
| PUT | `/users/me` | Update `name`, `phone`, `city`, `bio`, `photo`, `discoverable`. Returns `{ user }` |
| DELETE | `/users/me` | Delete the account and all of its data. `204` |
| GET | `/users/:id` | Public profile `{ user: { id, name, city, bio, photo, createdAt, discoverable } }`. `404` if the member hides their profile |

## Settings

| Method | Path | Description |
| --- | --- | --- |
| GET | `/settings` | `{ settings }` (created with defaults on first use) |
| PUT | `/settings` | Send any of `theme` (`light` or `dark`), `units.weight` (`kg` or `lb`), `units.length` (`cm` or `in`), `notify.<key>` booleans |

Notify keys: `workout`, `meal`, `progress`, `goal`, `reminder`, `community`.

## Workouts

`GET /workouts`, `POST /workouts`, `PUT /workouts/:id`, `DELETE /workouts/:id`

`PUT` merges the fields you send into the saved record.

```json
{
  "name": "Leg Day",
  "category": "Strength",
  "date": "2026-11-22",
  "duration": 50,
  "calories": 400,
  "notes": "",
  "tags": ["legs"],
  "exercises": [{ "id": "optional", "name": "Squat", "sets": 4, "reps": 8, "weight": 80 }]
}
```

Categories: `Strength`, `Cardio`, `HIIT`, `Flexibility`. Sorted by date, newest first.

## Nutrition

`GET /nutrition` (optional `?date=YYYY-MM-DD`), `POST /nutrition`, `PUT /nutrition/:id`, `DELETE /nutrition/:id`

Responses use `logs` and `log`.

```json
{
  "date": "2026-11-22",
  "mealType": "Lunch",
  "notes": "",
  "items": [{ "name": "Rice", "calories": 250, "protein": 5, "carbs": 50, "fats": 2 }]
}
```

Meal types: `Breakfast`, `Lunch`, `Dinner`, `Snack`. At least one food item is required.

## Progress

`GET /progress`, `POST /progress`, `PUT /progress/:id`, `DELETE /progress/:id`

Responses use `entries` and `entry`.

```json
{ "date": "2026-11-22", "weight": 78, "bodyFat": null, "waist": 84, "chest": null, "hips": null }
```

`weight` is required. The other measurements are optional (empty values are saved as `null`).

## Goals

`GET /goals`, `POST /goals`, `PUT /goals/:id`, `DELETE /goals/:id`. Pass `?today=` so the weekly workout count uses the member's own date.

```json
{ "title": "Reach 72 kg", "type": "weight", "start": 80, "target": 72, "unit": "kg", "deadline": "2026-12-31" }
```

Types: `weight`, `workouts`, `custom`. The server fills in:

- `current`: latest weight for `weight` goals, workouts in the last 7 days for `workouts` goals, the saved value for `custom` goals.
- `percent`: `0` to `100`.

## Reminders

`GET /reminders`, `POST /reminders`, `PUT /reminders/:id`, `DELETE /reminders/:id`

```json
{ "title": "Gym time", "type": "workout", "time": "18:30", "days": [0, 2, 4], "enabled": true, "note": "" }
```

Types: `workout`, `meal`, `water`, `weigh`, `custom`. `days` are `0` (Monday) to `6` (Sunday). `enabled` defaults to `true`. Sorted by time.

## Dashboard, analytics, reports, search

| Method | Path | Query | Description |
| --- | --- | --- | --- |
| GET | `/dashboard` | `today` | `{ stats, weekly, macros, goals, recent }` for the home screen |
| GET | `/analytics` | `days` (1-365, default 30), `today` | Totals, `trend`, `categories` and average `macros`. Ranges over 30 days are grouped by week |
| GET | `/reports` | `days`, `today` | `{ report }` with workouts, progress entries, goals and totals |
| GET | `/reports/csv` | `days`, `today` | CSV download of the workouts in the range |
| GET | `/search` | `q` (max 60 chars) | `{ workouts, meals, goals, members }`. Members are other discoverable members only |

Dashboard `stats`: `caloriesBurned` (last 7 days), `caloriesBurnedChange` (percent against the 7 days before, or `null`), `workoutsThisWeek`, `workoutsGoal`, `caloriesEaten` (today), `caloriesTarget`, `weight`, `weightChange` (kg against the previous entry, or `null`).

## Community

| Method | Path | Description |
| --- | --- | --- |
| GET | `/community/posts` | `{ posts, people }`. Optional `limit` (max 100) and `author` (member id) |
| POST | `/community/posts` | Body `title` (3+ chars), `body`, `topic`. `201 { post, people }` |
| POST | `/community/posts/:id/like` | Toggles your like. `{ post, people }` |
| POST | `/community/posts/:id/replies` | Body `text` (max 500). `201 { post, people }` |
| DELETE | `/community/posts/:id` | Only the author can delete. `204` |
| GET | `/community/people` | `{ people }` discoverable members |
| GET | `/community/following` | `{ ids }` |
| GET | `/community/followers` | `{ followers: [{ id, name, photo, at }] }` |
| POST | `/community/follow/:id` | Follow a member. `{ following: true }` |
| DELETE | `/community/follow/:id` | Unfollow. `204` |
| GET | `/community/members/:id/stats` | `{ stats: { posts, likes, followers, following } }` |
| GET | `/community/stats` | `{ stats: { members, posts, replies } }` |
| GET | `/community/contributors` | Top 5 members by activity |
| GET | `/community/alerts` | New `followers` and `replies` to your posts |

Topics: `workouts`, `nutrition`, `progress`, `motivation`, `questions`.

Posts hold `authorId` only. Names and photos come once in the `people` map (`{ [id]: { id, name, photo } }`), so photos are not repeated on every post.

## Notifications

Alerts are worked out in the app from the member's own data. The server only remembers which ones were read or dismissed.

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| GET | `/notifications` | - | `{ read: [ids], hidden: [ids] }` |
| POST | `/notifications/read` | `{ ids: [] }` | `{ read, hidden }` |
| POST | `/notifications/dismiss` | `{ ids: [] }` | `{ read, hidden }` |

## Support

| Method | Path | Description |
| --- | --- | --- |
| GET | `/support` | `{ requests }`, newest first |
| POST | `/support` | Body `type` (`question`, `issue`, `feedback`), `subject` (3+ chars), `message` (10+ chars). `201 { request }` with `status: "Received"` |
| DELETE | `/support/:id` | `204` |

## Your data

| Method | Path | Description |
| --- | --- | --- |
| GET | `/data/export` | Everything the member saved: profile, settings, workouts, nutrition, progress, goals, reminders and support messages |
| DELETE | `/data` | Clears workouts, nutrition, progress, goals, reminders, support messages, settings and notification state. The account and community posts stay. `204` |
