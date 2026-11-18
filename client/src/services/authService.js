import seedUsers from '../data/users.json'
import { storage } from '../utils/storage'
import { createStore } from './localStore'

const SESSION_KEY = 'ft_session'
const users = createStore('ft_users', seedUsers)

const withoutPassword = (user) => {
  const safe = { ...user }
  delete safe.password
  return safe
}

const startSession = (user) => {
  const safe = withoutPassword(user)
  storage.set(SESSION_KEY, JSON.stringify(safe))
  return safe
}

export const registerUser = async ({ name, email, password }) => {
  const list = users.read()
  const exists = list.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())

  if (exists) {
    throw new Error('An account with this email already exists')
  }

  const now = new Date().toISOString()
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    password,
    role: 'user',
    createdAt: now,
    consentAcceptedAt: now,
  }

  users.save([...list, user])
  return startSession(user)
}

export const loginUser = async ({ email, password }) => {
  const user = users
    .read()
    .find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)

  if (!user) {
    throw new Error('Incorrect email or password')
  }

  return startSession(user)
}

export const logoutUser = () => {
  storage.remove(SESSION_KEY)
}

export const getCurrentUser = () => {
  try {
    return JSON.parse(storage.get(SESSION_KEY))
  } catch {
    return null
  }
}
