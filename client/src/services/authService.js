import seedUsers from '../data/users.json'

const USERS_KEY = 'ft_users'
const SESSION_KEY = 'ft_session'

const readUsers = () => {
  const saved = localStorage.getItem(USERS_KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
  return seedUsers
}

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const withoutPassword = (user) => {
  const safe = { ...user }
  delete safe.password
  return safe
}

const startSession = (user) => {
  const safe = withoutPassword(user)
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
  return safe
}

export const registerUser = async ({ name, email, password }) => {
  const users = readUsers()
  const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase())

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

  saveUsers([...users, user])
  return startSession(user)
}

export const loginUser = async ({ email, password }) => {
  const users = readUsers()
  const user = users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  )

  if (!user) {
    throw new Error('Incorrect email or password')
  }

  return startSession(user)
}

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}