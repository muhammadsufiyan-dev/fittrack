import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import mongoose from 'mongoose'

process.env.NODE_ENV = 'test'

const { default: app } = await import('../src/app.js')
const { env } = await import('../src/config/env.js')
const { default: User } = await import('../src/models/User.js')

const testDb = 'fittrack_test'
const today = new Date().toISOString().slice(0, 10)

let server
let base

const call = async (method, path, { token, body } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const raw = await response.text()
  return { status: response.status, data: raw ? JSON.parse(raw) : null }
}

const wipe = async () => {
  assert.equal(mongoose.connection.name, testDb)
  await Promise.all(Object.values(mongoose.connection.models).map((Model) => Model.deleteMany({})))
}

const signUp = async (name, email) => {
  const password = 'Test1234'
  await call('POST', '/auth/register', { body: { name, email, password, consent: true } })
  await User.updateOne({ email }, { emailVerified: true })
  const { data } = await call('POST', '/auth/login', { body: { email, password } })
  return { token: data.token, id: data.user.id }
}

before(async () => {
  await mongoose.connect(env.mongoUri, { dbName: testDb })
  await wipe()
  server = app.listen(0)
  base = `http://127.0.0.1:${server.address().port}/api`
})

after(async () => {
  await wipe()
  await mongoose.disconnect()
  server.close()
})

describe('auth', () => {
  it('answers the health check', async () => {
    const { status, data } = await call('GET', '/health')
    assert.equal(status, 200)
    assert.equal(data.status, 'ok')
  })

  it('rejects a weak password', async () => {
    const { status } = await call('POST', '/auth/register', { body: { name: 'Ali Khan', email: 'ali@example.com', password: 'abc', consent: true } })
    assert.equal(status, 400)
  })

  it('rejects a photo that is not an image', async () => {
    const { status } = await call('POST', '/auth/register', {
      body: { name: 'Ali Khan', email: 'ali@example.com', password: 'Test1234', photo: 'javascript:alert(1)', consent: true },
    })
    assert.equal(status, 400)
  })

  it('registers, needs a verified email and logs in', async () => {
    const body = { name: 'Ali Khan', email: 'ali@example.com', password: 'Test1234', consent: true }

    const created = await call('POST', '/auth/register', { body })
    assert.equal(created.status, 201)
    assert.equal(created.data.token, undefined)

    assert.equal((await call('POST', '/auth/login', { body: { email: 'ali@example.com', password: 'Test1234' } })).status, 403)

    await User.updateOne({ email: 'ali@example.com' }, { emailVerified: true })

    assert.equal((await call('POST', '/auth/register', { body })).status, 409)
    assert.equal((await call('POST', '/auth/login', { body: { email: 'ali@example.com', password: 'wrong' } })).status, 401)

    const login = await call('POST', '/auth/login', { body: { email: 'ALI@example.com', password: 'Test1234' } })
    assert.equal(login.status, 200)
    assert.equal(login.data.user.password, undefined)
  })

  it('needs a token for private routes', async () => {
    assert.equal((await call('GET', '/auth/me')).status, 401)
    assert.equal((await call('GET', '/workouts', { token: 'not-a-token' })).status, 401)
  })

  it('does not break on an empty body', async () => {
    const { status } = await call('POST', '/auth/login')
    assert.equal(status, 401)
  })
})

describe('workouts, goals and reports', () => {
  let a
  let b
  let workoutId

  before(async () => {
    a = await signUp('Member A', 'a@example.com')
    b = await signUp('Member B', 'b@example.com')
  })

  it('creates a workout and validates it', async () => {
    const bad = await call('POST', '/workouts', { token: a.token, body: { name: 'Yoga', category: 'Dance', date: today } })
    assert.equal(bad.status, 400)

    const good = await call('POST', '/workouts', {
      token: a.token,
      body: { name: 'Leg Day', category: 'Strength', date: today, duration: 50, calories: 400, exercises: [{ name: 'Squat', sets: 4, reps: 8, weight: 80 }] },
    })
    assert.equal(good.status, 201)
    assert.equal(good.data.workout.exercises.length, 1)
    assert.equal(good.data.workout.user, undefined)
    workoutId = good.data.workout.id
  })

  it('keeps every member data private', async () => {
    assert.equal((await call('GET', '/workouts', { token: b.token })).data.workouts.length, 0)
    assert.equal((await call('PUT', `/workouts/${workoutId}`, { token: b.token, body: { duration: 1 } })).status, 404)
    assert.equal((await call('DELETE', `/workouts/${workoutId}`, { token: b.token })).status, 404)
    assert.equal((await call('GET', '/search?q=squat', { token: b.token })).data.workouts.length, 0)
  })

  it('updates only the fields that are sent', async () => {
    const { status, data } = await call('PUT', `/workouts/${workoutId}`, { token: a.token, body: { duration: 60 } })
    assert.equal(status, 200)
    assert.equal(data.workout.duration, 60)
    assert.equal(data.workout.name, 'Leg Day')
  })

  it('works out goal progress from the latest weight', async () => {
    await call('POST', '/progress', { token: a.token, body: { date: today, weight: 78 } })
    const { data } = await call('POST', '/goals', { token: a.token, body: { title: 'Reach 72 kg', type: 'weight', start: 80, target: 72, unit: 'kg' } })
    assert.equal(data.goal.current, 78)
    assert.equal(data.goal.percent, 25)
  })

  it('builds the dashboard, analytics, report and search', async () => {
    const dashboard = await call('GET', `/dashboard?today=${today}`, { token: a.token })
    assert.equal(dashboard.data.stats.workoutsThisWeek, 1)
    assert.equal(dashboard.data.weekly.length, 7)

    const analytics = await call('GET', `/analytics?days=7&today=${today}`, { token: a.token })
    assert.equal(analytics.data.totalWorkouts, 1)

    const report = await call('GET', `/reports?days=30&today=${today}`, { token: a.token })
    assert.equal(report.data.report.workouts.length, 1)

    const search = await call('GET', '/search?q=squat', { token: a.token })
    assert.equal(search.data.workouts.length, 1)
  })

  it('deletes a workout', async () => {
    assert.equal((await call('DELETE', `/workouts/${workoutId}`, { token: a.token })).status, 204)
    assert.equal((await call('DELETE', `/workouts/${workoutId}`, { token: a.token })).status, 404)
  })
})

describe('community', () => {
  let a
  let b
  let postId

  before(async () => {
    a = await signUp('Writer', 'writer@example.com')
    b = await signUp('Reader', 'reader@example.com')
  })

  it('creates a post, likes it and replies', async () => {
    const created = await call('POST', '/community/posts', { token: a.token, body: { title: 'First post', body: 'Hello', topic: 'workouts' } })
    assert.equal(created.status, 201)
    postId = created.data.post.id

    const liked = await call('POST', `/community/posts/${postId}/like`, { token: b.token })
    assert.equal(liked.data.post.liked, true)
    assert.equal(liked.data.post.likes.length, 1)

    const unliked = await call('POST', `/community/posts/${postId}/like`, { token: b.token })
    assert.equal(unliked.data.post.likes.length, 0)

    const reply = await call('POST', `/community/posts/${postId}/replies`, { token: b.token, body: { text: 'Welcome!' } })
    assert.equal(reply.status, 201)
    assert.equal(reply.data.post.replies.length, 1)
  })

  it('shows replies and followers as alerts', async () => {
    await call('POST', `/community/follow/${a.id}`, { token: b.token })
    const { data } = await call('GET', '/community/alerts', { token: a.token })
    assert.equal(data.followers.length, 1)
    assert.equal(data.replies[0].postTitle, 'First post')
  })

  it('counts member stats', async () => {
    const { data } = await call('GET', `/community/members/${a.id}/stats`, { token: b.token })
    assert.deepEqual(data.stats, { posts: 1, likes: 0, followers: 1, following: 0 })
  })

  it('blocks following yourself and deleting other posts', async () => {
    assert.equal((await call('POST', `/community/follow/${a.id}`, { token: a.token })).status, 400)
    assert.equal((await call('DELETE', `/community/posts/${postId}`, { token: b.token })).status, 404)
  })

  it('ignores operators in the author filter', async () => {
    const { status, data } = await call('GET', '/community/posts?author[$ne]=x', { token: a.token })
    assert.ok(status === 200 || status === 400)
    if (status === 200) assert.equal(data.posts.length, 1)
  })

  it('removes a member and everything they wrote', async () => {
    assert.equal((await call('DELETE', '/users/me', { token: b.token })).status, 204)
    assert.equal((await call('GET', '/auth/me', { token: b.token })).status, 401)

    const { data } = await call('GET', '/community/posts', { token: a.token })
    assert.equal(data.posts[0].replies.length, 0)
    assert.equal((await call('GET', '/community/followers', { token: a.token })).data.followers.length, 0)
  })
})
